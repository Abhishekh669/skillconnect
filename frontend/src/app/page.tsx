'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createUser } from "@/lib/actions/user/post/user.post";
import { createProduct } from "@/lib/actions/product/post/product";
import { Input } from "@/components/ui/input";

import {toast} from 'react-hot-toast'



export default function Home() {
  const [price, setPrice] = useState<number>(14999)
  const [users, setusers] = useState([])

  useEffect(()=>{
    setPrice(2000);
    
  },[])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/user/get/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setusers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  
  const handleCreateuser = async() =>{
      
  }

  const handleCreateProduct = async() =>{

    const res = await createProduct({
      name: "Mountain Bike",
      description: "High-performance mountain cycle suitable for off-road and daily commute.",
      price: 14999,
      image: "/cycle.webp",
      category: "Bikes"
    });

    if(res.error){
      console.error("Error creating product:", res.error);
    } else {
      console.log("Product created successfully:", res.product);
    }
  }

  const handleEsewaPayment = () =>{

  }

  const handleKalthiPayment = () =>{

  }
  const handleClick = (e  : any) =>{
    e.preventDefault();
    
    toast.success("i love you too")
  }
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-gray-50">
      <Card className="shadow-md w-[400px] rounded-2xl">
        <CardHeader className="text-xl font-semibold text-center">
          Cycle Store
        </CardHeader>
        <CardContent>
           <div>
        Users : 
        {users && users.length > 0  &&  users.map((user: any) => (
          <div key={user._id} className="p-4 bg-white shadow-md rounded-md my-2">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/cycle.webp"
              width={400}
              height={400}
              alt="Cycle"
              className="rounded-xl object-cover w-full h-[200px]"
            />
            <div className="text-lg font-medium text-gray-800">Mountain Bike</div>
            <div className="text-gray-600 text-sm text-center px-2">
              High-performance mountain cycle suitable for off-road and daily commute.
            </div>
            <div className="text-green-600 text-xl font-semibold">₹ {price}</div>
            <Button className="w-full">
              Buy Now
            </Button>
          </div>
          <div className="shadow-md my-2 p-4 rounded-md flex justify-between">
              <Button className="bg-green-600 hover:bg-green-500" onClick={handleEsewaPayment}>
                Pay with Esewa
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-500" onClick={handleKalthiPayment}>
                Pay with Kalthi
              </Button>
          </div>
          <div className="mt-4 space-y-2">
           <Button onClick={handleCreateuser} className="w-full bg-blue-600 hover:bg-blue-500">
            Create User
           </Button>
            <Button onClick={handleCreateProduct} className="w-full bg-blue-600 hover:bg-blue-500">
            Create Product
           </Button>
          </div>
        </CardContent>
      </Card>
      <div>
     kasto xa tw ? 
     leave i love you in the comment  hello wrodl
    <Input placeholder="commet please" />
    <Button onClick={handleClick}>I love you</Button>
      </div>
     
    </div>
  );
}
