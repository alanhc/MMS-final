from subprocess import Popen, PIPE
from Crypto.Util import number
import math


def genetate_key(N, p, q, file_sk, file_pk):
    print(N, p, q)
    p = Popen(f"python ntru/ntru.py -v gen {N} {p} {q} {file_sk} {file_pk}".split(" "))
    p.communicate()
    p.wait()
def encrypt(file_pk, msg, save_file=None):
    cmd1 = f"echo {msg} | python ntru/ntru.py enc {file_pk}"
    p = Popen(cmd1, shell=True, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    p.wait()
    if (save_file):
        with open(save_file, "wb") as f:
            f.write(stdout)
    return stdout
def decrypt(file_sk, secret_file=None):
    if (secret_file):
        cmd2 = f"cat {secret_file} | python ntru/ntru.py dec {file_sk}"
        p = Popen(cmd2, shell=True, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate()
    return stdout
##genetate_key(167, 3, 128, "sk", "pk") # N=167質數, p=3, q=128
#N = number.getPrime(10)
#genetate_key(N, 3, 128, "sk", "pk")
#encrypt("pk.npz", "abc")
#print( decrypt("sk.npz", "ntru/test.txt") )
