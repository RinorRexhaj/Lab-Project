import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
const Products = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-5xl font-semibold    flex justify-center items-center">Products</h1>
            <Card>
                <CardTitle>Product 1</CardTitle>
                <CardContent>Product 1 Description</CardContent>
            </Card>
        </div>
    ) 
}

export default Products