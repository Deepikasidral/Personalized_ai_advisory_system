import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cropOptions = [
  "Wheat",
  "Rice",
  "Maize",
  "Sugarcane",
  "Cotton",
  "Vegetables",
  "Fruits",
  "Other"
];

const Registration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    crop: "",
    experience: ""
  });
   const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/farmers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("farmerEmail", data.farmer.email);
      localStorage.setItem("farmerId", data.farmer._id);

      alert("Registration successful!");
      navigate("/dashboard");
    } else {
      const error = await res.json();
      alert("Error: " + error.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};



  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="w-full max-w-lg p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Farmer Registration</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <Input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
            />
            <Textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block mb-1 text-sm font-medium">Type of Crop</label>
              <select
                name="crop"
                value={form.crop}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Crop</option>
                {cropOptions.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <Input
              name="experience"
              type="number"
              min="0"
              placeholder="Years of Experience"
              value={form.experience}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Register
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Registration;