"use client"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft } from 'lucide-react'

function AddClient() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: null,
    pincode: "",
    billing_nm: "",
    gst_num: "",
    billing_address: "",
    created_by: "admin" // Default value or get from auth context
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Add current date to form data
      const submitData = {
        ...formData,
        dd: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      }

      const response = await axios.post(
        "https://namami-infotech.com/ACM/src/client/add_client.php",
        submitData
      )

      if (response.data.success) {
        setSuccess("Client added successfully!")
        setTimeout(() => navigate("/client-list"), 1500)
      } else {
        setError(response.data.message || "Failed to add client")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box elevation={3} sx={{ p: 1, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Add New Client
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 10 }}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Billing Name"
              name="billing_nm"
              value={formData.billing_nm}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GST Number"
              name="gst_num"
              value={formData.gst_num}
              onChange={handleInputChange}
              inputProps={{ maxLength: 15 }}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Billing Address"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save size={18} />}
                disabled={loading}
                sx={{
                  backgroundColor: "#F69320",
                  "&:hover": {
                    backgroundColor: "#e08416",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Client"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default AddClient