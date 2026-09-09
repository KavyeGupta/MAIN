//array all questions;
#include<stdio.h>
int main(){


int a[100],n,sum=0, i, counte=0,counto=0, sumE=0, min,max,temp,j,k;


//get array size------------------
printf("enter no of terms in da array\n");
scanf("%d",&n);

//get array element-------------------
printf("ENTER elements\n");
for (i=0;i<n;i++){
scanf("%d", &a[i]);
}

//_______________________
//print array
for(i=0;i<n;i++)
printf("%d\t", a[i]);

//_______________________
//print the sum of elements--------------------------------
for(i=0;i<n;i++){
    sum = sum + a[i];
}
    printf("The sum is %d\n", sum);

//_______________________
//QUE~count odd and even
for(i=0;i<n;i++){
if(a[i]%2==0){
    counte=counte+1;
}
else{ counto=counto+1;
    
}
}
printf("no if even terms = %d, no of odd terms = %d\n", counte, counto);


//_______________________
//QUE~ Sum of even elements------------------
for(i=0;i<n;i++)
if(a[i]%2==0){
    sumE=sumE+a[i];
}
printf("sum of even = %d\n", sumE);

//_______________________
//QUE~minimum maximum **impp
min=max=a[0];

for(i=1;i<n;i++)
    if(a[i]>max){
    max=a[i];
 }
    if(a[i]<min){
        min=a[i];
    }
    printf("minimum=%d, maximum=%d", min,max);

//_______________________
//QUE:reverse the array~
//note n-1 we will use not n because it starts form 0 
//if 5 then 0 1 2 3 4
for(i=0,j=n-1;i<j;i++,j--){
    temp=a[i];
    a[i]=a[j];
    a[j]=temp;


}
//ratta trust that it reverse 
printf("Reversed array is ");
for(i=0;i<n;i++){
    printf("%d",a[i]);
}




return 0;
}