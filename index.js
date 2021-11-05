const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const ProductData=require("./model/ProductData")
const app=express();
dotenv.config({path:'./config.env'});
require('./database/conn');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));

var allowedDomains = ['https://bhoomi-frontend-admin.herokuapp.com','http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);
   
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }));

//adding products
app.get('/',(req,res)=>{res.send("hiiii");})
app.post('/addproduct',async(req,res)=>{
    try {
        
    const{name,brand,category,description,quantity,price,discount}=req.body;
    const images=req.body.images;
    const newProduct=new ProductData({name,category,brand,description,quantity,price,discount,images});
                newProduct.save().then(()=>{
                    res.status(200).send({message:"product added"});

                }).catch((err)=>{
                    console.log(err.message);
                    res.status(500).send({message:"Something went Wrong"});

                })
    
    } catch (error) {
        console.log(error);
    }
})

//editing the products
app.post('/edit/:id',async(req,res)=>{
    try {
        var editProduct=req.params['id'];
        const{name,brand,category,description,quantity,price,discount}=req.body;
        const images=req.body.images;
        if(!images)
        {
           res.status(401).send({message:"Please upload the image"});
        }
        const productinfoupdate=await ProductData.findOneAndUpdate({_id:editProduct},
            {
                name:name,
                brand:brand,
                category:category,
                description:description,
                quantity:quantity,
                price:price,
                discount:discount,
                images:images,
            });
        if(productinfoupdate)
        {
            res.status(200).send({message:"product updated successfully"});
        }
    } catch (error) {
        console.log(error);
    }
})

//fetching all products
app.get("/fetch",async(req,res)=>{
    try {
        
        const allproduct=await ProductData.find({});
        res.status(200).send(allproduct);
    } catch (error) {
        console.log(error);
    }
})

app.get("/fetch/:id",async(req,res)=>{
    try {
        var productId=req.params['id'];
        const product=await ProductData.findOne({_id:productId});
        res.status(200).send(product);
    } catch (error) {
        console.log(error);
    }
})

app.delete("/delevent",async(req,res)=>{
    try {
    const response=await ProductData.findOneAndDelete({_id:req.body.id});
    res.status(200).send({message:"deleted successfully"});
        
    } catch (error) {
        console.log(error);
    }
})

//fetching specific product for editing
app.get('/edit/:id',async(req,res)=>{
   
    var editProduct=req.params['id'];
    const response=await ProductData.find({_id:editProduct});
    res.status(200).send(response[0]);
})



app.listen(process.env.PORT || 3002,()=>{
    console.log(`server running at port 3002`);
})
