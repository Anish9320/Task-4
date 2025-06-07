require("dotenv").config()
const { createClient } = require("@supabase/supabase-js")

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKEY = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseURL,supabaseKEY)

const connection = async() =>{
    try{
        const {data , error } = await supabase
        .from("images")
        .select("*")

        if(error){
            console.log("Supabase connection error: ",error)
            return false
        }
        if(data){
            console.log("Connection Created!!!")
            return true;
        }
    }
    catch(error){
        console.log(error)
        return false;
    }
}
connection();
module.exports = { supabase ,connection}