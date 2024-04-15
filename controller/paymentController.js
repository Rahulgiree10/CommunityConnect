const axios=require('axios')
const {v4:uuidv4}=require('uuid')
require('dotenv').config()


exports.initializeKhaltiPayment= async (req, res)=>{
    const khaltiSecretKey=process.env.KHALTI_SECRET_KEY
    const {payableAmount}=req.body;



    const khaltiRequest={
        return_url: process.env.RETURN_URL,
        website_url:process.env.ORIGIN,
        amount:parseInt(payableAmount,10)*100, //Khalti accepts amount in Paisa
        purchase_order_id:uuidv4(),
        purchase_order_name:'House Rent'
    }

    console.log(khaltiRequest);

    try {
        const response=await axios.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            khaltiRequest,
            {
                'headers':{
                    'Authorization':`Key ${khaltiSecretKey}`
                },
                'Content-Type': 'application/json'
            }
        )

        console.log(response.data);
        res.redirect(response.data.payment_url)
    } catch (error) {
        console.log(error.response.data);
    }
}