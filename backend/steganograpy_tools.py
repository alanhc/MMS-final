import cv2
import numpy as np
import random

def encode(cover_img_src, secret_img_src, seed):
    cover_img = cv2.imread(cover_img_src)
    secret_img = cv2.imread(secret_img_src, cv2.IMREAD_GRAYSCALE) // 255

    cover_img_h, cover_img_w, _ = np.shape(cover_img)
    secret_img_h, secret_img_w = np.shape(secret_img)

    random.seed(seed)
    coor = [[y, x] for y in range(cover_img_h) for x in range(cover_img_w)]
    rand_coor = random.sample(coor, secret_img_h * secret_img_w)

    secret_coor = [[y, x] for y in range(secret_img_h) for x in range(secret_img_w)]

    res_img = cover_img.copy()

    for coor1, coor2 in zip(secret_coor, rand_coor):
        secret_img_y = coor1[0]
        secret_img_x = coor1[1]
        cover_img_y = coor2[0]
        cover_img_x = coor2[1]

        b = format(cover_img[cover_img_y][cover_img_x][0], "b")

        res_b = b[:-1] + str(secret_img[secret_img_y][secret_img_x])

        res_img[cover_img_y][cover_img_x][0] = int(res_b, 2)

    return res_img


def decode(stego_img_src, seed, secret_img_size):
    stego_img = cv2.imread(stego_img_src)
    stego_img_h, stego_img_w, _ = np.shape(stego_img)

    secret_img_h, secret_img_w = secret_img_size

    random.seed(seed)
    coor = [[y, x] for y in range(stego_img_h) for x in range(stego_img_w)]
    rand_coor = random.sample(coor, secret_img_h * secret_img_w)

    secret_coor = [[y, x] for y in range(secret_img_h) for x in range(secret_img_w)]

    res_img = np.zeros((secret_img_h, secret_img_w))

    for coor1, coor2 in zip(secret_coor, rand_coor):
        secret_img_y = coor1[0]
        secret_img_x = coor1[1]
        stego_img_y = coor2[0]
        stego_img_x = coor2[1]

        b = format(stego_img[stego_img_y][stego_img_x][0], "b")
        res_b = b[-1]
        res_img[secret_img_y][secret_img_x] = int(res_b, 2) * 255

    return res_img

# save file as png!
#stego_img = encode("test_file/img1.jpg", "test_file/qrcode.png", 100)
#cv2.imwrite("test_file/stego_img.png", stego_img)

#decode_img = decode("test_file/stego_img.png", 100, [210, 210])
#cv2.imwrite("test_file/decode_img.png", decode_img)

if __name__ == '__main__':
    pass