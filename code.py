import numpy as np

str3=""
z=""
def encryption1(str1,x):
    
    def encrytion(b,c,d,A):
        global result
        global result1
        global result2
        global str3
        global z
        #str3=""
        l1=[]
        l2=[]
        l3=[]
        l=[]
        for i in b:
            l1.append(ord(i))
        if len(l1)==3:
            l.append(l1)
        else:
            if len(l1)==0:
                for i in range(0,3):
                    l1.append(0)
            elif len(l1)==1:
                for i in range(0,2):
                    l1.append(0)
            else:
                for j in range(0,1):
                    l1.append(0)
        l.append(l1)
        for j in c:
            l2.append(ord(j))
        if len(l2)==3:
            l.append(l2)
        else:
            if len(l2)==0:
                for i in range(0,3):
                    l2.append(0)
            elif len(l2)==1:
                for i in range(0,2):
                    l2.append(0)
            else:
                for j in range(0,1):
                    l2.append(0)
        l.append(l2)
        for k in d:
            l3.append(ord(k))
        if len(l3)==3:
            l.append(l3)
        else:
            if len(l3)==0:
                for i in range(0,3):
                    l3.append(0)
            elif len(l3)==1:
                for i in range(0,2):
                    l3.append(0)
            else:
                for j in range(0,1):
                    l3.append(0)
        l.append(l3)
        str2=""
        result=np.dot(l1,A)
        for i in result:
            str2=str2+chr(i)
        result1=np.dot(l2,A)
        for j in result1:
            str2=str2+chr(j)
        result2=np.dot(l3,A)
        for k in result2:
            str2=str2+chr(k)
        str3=str3+str2
        #print(str3)


        inversematrix=np.linalg.inv(A)
        result3=np.dot(result,inversematrix)
        result4=np.dot(result1,inversematrix)
        result5=np.dot(result2,inversematrix)



        i=decryption(inversematrix,result3,result4,result5)
        z=z+str(i)
        return str3
    def decryption(inversematrix,result3,result4,result5):
        str=""

        for i in result3:
            a=round(i)
            a=chr(a)
            str=str+a


        for j in result4:
            b=round(j)
            b=chr(b)
            str=str+b
        for k in result5:
            c=round(k)
            c=chr(c)
            str=str+c
        return str

    z=""
    str3=""
    X=x+2
    Y=x-1
    Z=x**2
    B=x+(2*x)+(5**x)
    C=(x**2)+x-1
    D=x**3+x-1
    P=(x**3)//4
    Q=x+(x**2)+1
    R=(x**3)+(x**2)+(x*4)
    A=[[X,Y,Z],[B,C,D],[P,Q,R]]
    #print(A)
    #str1=input("enter the string to encryted:")

    m=len(str1)
    e=0
    if m<=9:
        a=str1[:9]
        b=a[:3]
        c=a[3:6]
        d=a[6:9]
        b=encrytion(b,c,d,A)

    else:
        while e<=m:
            a=str1[e:e+9]
            b=a[:3]
            c=a[3:6]
            d=a[6:9]
            b=encrytion(b,c,d,A)
            e=e+9
    #print("the intermediate string:",str3)


x=int(input("enter the number for key matrix to be generated:"))
str1=input("enter the string to be encrypted:")
encryption1(str1,x)



print("INTERMEDIATE STRING:",str3)
#print('decrypted string',str)


def decryption1(str3):
    global z
    #print(str3)
    print("THE DECRYPTED STRING:",z)
decryption1(str3)


















        
        


