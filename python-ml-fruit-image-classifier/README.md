# First Step

Clone this remote repot to your local:  
`git clone git@github.com:Shawn9797/FruitImageClassifier.git`

Actually you don't need to do this now since you can get the images from cloning:  
Set your dataset in the root directory (where the code file is):  
1. unzip train.zip/test.zip  
2. set up four folders ('apple','banana','orange','mixed') in train/test folders respectively  
3. put all the images of each category into corresponding folder

Note:  Remember to create and push **branches** when you modify the code

# 20240523:
## Where we are:
A basic classifier   
1. basic functions: read and preprocessing image data, model training, model testing, a little visualization  
2. acceptable performance: 90% accuracy for train_data ; 87% accuracy for test_data

## What we need to do now?
1. more visualization with good-looking graph
2. improve performance 
3. write report

## Tasks which may improve performance:
(Try to implement these after you understand current codes)
1. Adjust hyperparameter:  
    - standard_size
    - parameters of some method (e.g. Image.resize())
    - parameters of layers in CNN
2. Add more data to make dataset more balanced  
    - find more image of 'mixed'
    - Image Augmentation to generate more data for 'mixed'
3. Use more technique (e.g cross validation)
4. correct any mis-labelling ???





