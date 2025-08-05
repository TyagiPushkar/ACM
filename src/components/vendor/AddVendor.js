"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete,
  Paper,
  Grid
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft } from 'lucide-react'

function AddVendor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    address: "",
    city: "",
    state_id: "",
    cities_id: "",
    created_by: "admin" // Default value or get from auth context
  })

  // Fetch states and cities data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("https://namami-infotech.com/ACM/src/location/cities.php")
        if (response.data.success) {
          setStates(response.data.data)
        } else {
          setError("Failed to load location data")
        }
      } catch (err) {
        setError("Error fetching location data")
      }
    }
    fetchLocations()
  }, [])

  // Update cities when state changes
  useEffect(() => {
    if (formData.state_id) {
      const selectedState = states.find(state => state.state_id.toString() === formData.state_id)
      if (selectedState) {
        setCities(selectedState.cities.map((city, index) => ({
          id: index + 1,
          name: city
        })))
      }
    }
  }, [formData.state_id, states])

  const handleStateChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        state: value.state_name,
        state_id: value.state_id.toString(),
        city: "",
        cities_id: ""
      })
    } else {
      setFormData({
        ...formData,
        state: "",
        state_id: "",
        city: "",
        cities_id: ""
      })
    }
  }

  const handleCityChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        city: value.name,
        cities_id: value.id.toString()
      })
    } else {
      setFormData({
        ...formData,
        city: "",
        cities_id: ""
      })
    }
  }

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
        "https://namami-infotech.com/ACM/src/vendor/add_vendor.php",
        submitData
      )

      if (response.data.success) {
        setSuccess("Vendor added successfully!")
        setTimeout(() => navigate("/vendors"), 1500)
      } else {
        setError(response.data.message || "Failed to add vendor")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding vendor")
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
          Add New Vendor
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Vendor Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <Autocomplete
              options={states}
              getOptionLabel={(option) => option.state_name}
              onChange={handleStateChange}
              value={states.find(state => state.state_id.toString() === formData.state_id) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  required
                  sx={{ mb: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.state_id === value.state_id}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.name}
              onChange={handleCityChange}
              value={cities.find(city => city.id.toString() === formData.cities_id) || null}
              disabled={!formData.state_id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  required
                  sx={{ mb: 2 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          <Grid item xs={12} md={8}>
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Vendor"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default AddVendor