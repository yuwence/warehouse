import cv2
import numpy as np
import math
import json
image =cv2.imread("./public/image/input.jpg") #do 5 kosov visoka
output = image.copy()
img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
S = []
Center = []


gaussian = cv2.GaussianBlur(img, (13,13),2)
edges = cv2.Canny(gaussian,10,50,apertureSize=3)
ret,thresh = cv2.threshold(edges,200,255,cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
for cnt in contours:
    if len(cnt)>50:
        S1 = cv2.contourArea(cnt)
        ell = cv2.fitEllipse(cnt)
        S2 = math.pi * ell[1][0]*ell[1][1]
        if(S1/S2)>0.0003:
            img = cv2.ellipse(img,ell,(0,255,0),-1)
            if(S2 > S1):
                S.append(S2)
                Center.append(ell[0])

data_json = {
    "x_c" : Center[S.index(max(S))][0],
    "y_c" : Center[S.index(max(S))][1],
    "S" : max(S)
}

if (S and Center) is not None:
    print(json.dumps(data_json))
else:
    print(ValueError)
# show the output image 
""" cv2.imshow("o",img)
cv2.imshow("edges",thresh)
cv2.imshow("output",output)
cv2.waitKey(0) """

""" 
1 --> 47555.797     
2 --> 54495.3257
3 --> 61934.139
4 --> 70604.76
5 --> 82578.91

d = 11974.15    5 - 4 
d = 8670.62     4 - 3
d = 7438.81     3 - 2
d = 6939,5287   2 - 1

gain = 1,38     5-4 / 4-3 
gain = 1,16     4-3 / 3-2
gain = 1,07     3-2 / 2-1 eksponentna funkcija

"""