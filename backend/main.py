from unittest import result
from tools import *
from mongo import *
from dotenv import load_dotenv
from fastapi import FastAPI, Form, Depends, HTTPException, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests
from datetime import datetime, timedelta
import pymongo
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.responses import StreamingResponse
from PIL import Image
import io
import ntru_tools as ntru

load_dotenv()
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

"""_summary_
uvicorn main:app --reload
"""

origins = [
    "https://stormy-temple-44410.herokuapp.com",
    "http://localhost:8000",
    "http://localhost:3000",
    "https://dsr-team.github.io"
]
description = """
Hello, welcome to Multimedia Security-Term-project!
"""

app = FastAPI(
    docs_url=None, redoc_url=None,  
    title="Multimedia Security-Term-project",
    description=description,
    version="0.1.0",
    contact={
        "name": "",
        "uri": "",
        "email": ""
    }
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/docs", include_in_schema=False)
async def overridden_swagger():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Multimedia Security-Term-project",
        swagger_favicon_url="/static/favicon.ico"
    )
@app.get("/redoc", include_in_schema=False)
def overridden_redoc():
	return get_redoc_html(
        openapi_url="/openapi.json", 
        title="Multimedia Security-Term-project", 
        redoc_favicon_url="/static/favicon.ico"
    )

@app.get("/login/{address}/payload/")
async def payload(address):
    now = datetime.now()
    msg = "Tezos Signed Message: Confirming my identity as {address} on https://dsr-team.github.io/, time: {timestamp}".format(
        address=address, timestamp=now)
    payload = pack_str(msg)
    # todo: save msg to db
    Col_login.insert_one({'address': address, 'msg': msg, "time": now})
    return {"payload": payload}


@app.post("/login/")
async def login(address: str = Form(""), signature: str = Form("")):
    
    pubKey = requests.get(
        'https://api.tzkt.io/v1/accounts/{address}'.format(address=address)).json()['publicKey']

    cursor = Col_login.find({'address': address}).sort(
        'time', pymongo.DESCENDING).limit(1)
    msg = list(cursor)[0]["msg"]
    
    _ = verifyUserSignature(msg=msg, sig=signature, pubKey=pubKey, raw=False)
    
    Col_login.delete_many({'address': address})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"addr": address}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/renew_token/")
async def renew_token(address=Depends(get_current_active_user)):

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"addr": address}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/activate_tocket/{contract}/{tokenId}")
async def activate_tocket(contract, tokenId, address=Depends(get_current_active_user)):
    print(contract, tokenId, address)
    result = {}
    result["address"] = address
    def iterfile():  # 
        with open("static/stego_img.png", mode="rb") as file_like:  # 
            yield from file_like  
    return StreamingResponse(iterfile(), media_type="image/png")

@app.post("/qrcode/{contract}/{tokenId}")
async def activate_tocket(contract, tokenId, file: bytes = File(None), address=Depends(get_current_active_user)):
    if file is not None:
        image = Image.open(io.BytesIO(file))
        image.save("static/save.png")
        def iterfile():  # 
            with open("static/qrcode.png", mode="rb") as file_like:  # 
                yield from file_like  
        return StreamingResponse(iterfile(), media_type="image/png")
    else:
        return HTTPException(status_code=400, detail="No file")

@app.post("/verify/{contract}/{tokenId}")
async def verify_ticket(contract, tokenId, file: bytes = File(None), address=Depends(get_current_active_user)):
    if file is not None:
        ciphertext = io.BytesIO(file).read()
        #print(ciphertext)
        secret = ntru.decrypt(file_sk="sk.npz", ciphertext=ciphertext).decode("utf-8")
        print(secret)
        if (secret=="hello\n"):
            return {"status": "success"}
        else:
            return {"status": "fail"}
    else:
        return HTTPException(status_code=400, detail="No file")

@app.get("/collections/{address}")
async def get_collections_by_address(address):
    result = {}
    result["result"] = get_nft(address)

    return result


