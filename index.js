var mongoose = require("mongoose");
var express  = require("express");
var faker    = require("faker");

var app = express();
mongoose.connect("mongodb://localhost:27017/dbtab",{useCreateIndex:true,useNewUrlParser:true,
useFindAndModify:true,useUnifiedTopology:true})
.then(()=>{
    console.log("connected to server");
})
.catch((err)=>{
    console.log("db connection error",err);
})

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//mongo schma 
var demoSchema = new mongoose.Schema({
      name:{
          type:String
      },
      company:{
          type:String
      }
});

var demoModel = mongoose.model("demos",demoSchema);

//default page
app.get('/', function (req,res) {
     res.render('index.html');
});
 
app.post('/page',(req,res)=>{
    console.log("page",req.body.start)
    var query = {};
    if(req.body.start>0){
        query.skip = parseInt(req.body.start);
    }
    else{
        query.skip = 0;
    }
    query.limit = parseInt(req.body.length);
    query.sort  = {"_id":parseInt(1)}
    demoModel.find({},{},query,(err,data)=>{
       if(err){
           console.log(err);
       }  
       else if(data.length){
           demoModel.find().count((err,countData)=>{
             if(err){
                 console.log(err);
             }
             else{
                var dataa = {'data':data,"recordsFiltered":countData,"recordsTotal":countData}
                res.json(dataa);
             }
           });
       }
       else{
                 for(var i=1;i<=100;i++){
                     let demo = new demoModel({
                         name :"name"+i,
                        company:"company"+i
                     });
                     demo.save((err,dataa)=>{
                         if(err){
                             console.log(err);
                         }
                     });
                 }

                        demoModel.find({},{},query,(err,fdata)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                demoModel.find().count((err,countData)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(countData){
                                        console.log(countData);
                                
                                        demoModel.find({},{},query,(err,fdata)=>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                            var dataa = {'data':fdata,"recordsFiltered":countData,"recordsTotal":countData}
                                            res.json(dataa);
                                            }
                                        });
                                    }
                                    else{
                                        console.log("no data found");
                                    }
                                });
                        }
                });
           }
    });
});

app.listen(3000, () => {
    console.log('Server is up and running');
});