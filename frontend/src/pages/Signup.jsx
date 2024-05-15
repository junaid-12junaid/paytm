import { useState } from "react";
import { Heading } from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import { Button } from "../components/Button";

import axios from "axios"

import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";

export default function Signup(){
    let [firstName,setFirstName]=useState("")
    let [lastName,setLastName]=useState("")
    let [username,setUsername]=useState("")
    let [password,setPassword]=useState("")
  let navigate=useNavigate()

    return (
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"}/>
                <SubHeading label={"Enter your infromation to create an account"}/>
                <InputBox onChange={(e)=>{
                  setFirstName(e.target.value)  
                }} placeholder="John" label={"First Name"}/>
                <InputBox onChange={(e)=>{
                  setLastName(e.target.value)  
                }} placeholder="Doe" label={"Last Name"}/>
                <InputBox onChange={(e)=>{
                  setUsername(e.target.value)  
                }} placeholder="junaid@gmail.com" label={"Email"}/>
                <InputBox onChange={(e)=>{
                  setPassword(e.target.value)  
                }} placeholder="123456" label={"Password"}/>
                <div className="pt-4">
                <Button onClick={async ()=>{
                  let res=await axios({
                    url:"http://localhost:3001/api/v1/user/signup",
                    method:"POST",
                    data:{
                      username,
                      firstname:firstName,
                      lastname:lastName,
                      password
                    }
                  })
                  console.log(`the res`,res)
                  localStorage.setItem("token",res.data.token)
                  navigate("/dashboard")

                }} label={"Sign up"}/>
                  

                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}/>
            </div>
        </div>
    </div>
    )
}