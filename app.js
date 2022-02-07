const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));   // To use static files like css and images 
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){

    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    const data= {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us20.api.mailchimp.com/3.0/lists/6d7f0639d1";
    const options= {
        method: "POST",
        auth: "kshitij:3a4a1d33e46d4999be27ed1976f71175-us20"
    }

    const request=https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    app.post("/failure",function(req,res){
        res.redirect("/");
    });

    request.write(jsonData);
    request.end();
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});


// API KEY
// 3a4a1d33e46d4999be27ed1976f71175-us20

// LIST ID
// 6d7f0639d1