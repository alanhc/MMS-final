import qrcode

def make_qrcode(msg, save_path=None):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=0,
    )
    qr.add_data(msg)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    if save_path:
        img.save(save_path)
    else:
        return img
#make_qrcode("aaa", "a.png")
