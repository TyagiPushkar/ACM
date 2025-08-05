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
  Grid,
  MenuItem,
  InputAdornment
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft } from 'lucide-react'

function AddConsignment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [clients, setClients] = useState([])
  const [vendors, setVendors] = useState([])
  const [formData, setFormData] = useState({
    airway_billno: "",
    vairway_billno: "",
    client_id: "",
    client_name: "",
    client_address: null,
    vendor_id: "",
    vendor_name: "",
    date_exp: "",
    status: "IN TRANSIT",
    destination: "",
    mode: "Road",
    consignee: "",
    status_dt: "",
    status_time: "",
    remarks: "",
    act_weight: "",
    vol_weight: "",
    bill_weight: 0,
    qty: 0,
    charges_qty: 0,
    inv_v: "",
    fov: 0,
    dkt: 0,
    oda: 0,
    extra: 0,
    pod_fol: "",
    pod: "",
    del_dtt: ""
  })

  // Fetch clients and vendors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, vendorsRes] = await Promise.all([
          axios.get("https://namami-infotech.com/ACM/src/client/client_list.php"),
          axios.get("https://namami-infotech.com/ACM/src/vendor/vendor_list.php")
        ])
        
        if (clientsRes.data.success) setClients(clientsRes.data.data)
        if (vendorsRes.data.success) setVendors(vendorsRes.data.data)
      } catch (err) {
        setError("Failed to load client/vendor data")
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleClientChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        client_id: value.id,
        client_name: value.name,
        client_address: value.address
      })
    } else {
      setFormData({
        ...formData,
        client_id: "",
        client_name: "",
        client_address: ""
      })
    }
  }

  const handleVendorChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        vendor_id: value.id,
        vendor_name: value.name
      })
    } else {
      setFormData({
        ...formData,
        vendor_id: "",
        vendor_name: ""
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Add current date/time and created_by
      const now = new Date()
      const submitData = {
        ...formData,
        created_by: "admin", // Replace with actual user from auth context
        dd: now.toLocaleDateString('en-GB').replace(/\//g, '/'), // DD/MM/YYYY format
        dd_time: `${now.toLocaleDateString('en-GB').replace(/\//g, '/')} ${now.toLocaleTimeString()}`
      }

      const response = await axios.post(
        "https://namami-infotech.com/ACM/src/consignment/add_consignment.php",
        submitData
      )

      if (response.data.success) {
        setSuccess("Consignment added successfully!")
        setTimeout(() => navigate("/consignments"), 1500)
      } else {
        setError(response.data.message || "Failed to add consignment")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding consignment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box elevation={3} sx={{ pb: 1, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Add New Consignment
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
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Airway Bill No"
              name="airway_billno"
              value={formData.airway_billno}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor Airway Bill No"
              name="vairway_billno"
              value={formData.vairway_billno}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              onChange={handleClientChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  required
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={vendors}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              onChange={handleVendorChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vendor"
                  required
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              label="Client Address"
              name="client_address"
              value={formData.client_address}
              onChange={handleInputChange}
              required
              multiline
              rows={2}
            />
          </Grid> */}

          {/* Dates Section */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Expected Delivery Date"
              type="date"
              name="date_exp"
              value={formData.date_exp}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Status Date"
              type="date"
              name="status_dt"
              value={formData.status_dt}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Status Time"
              type="time"
              name="status_time"
              value={formData.status_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Consignment Details */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              select
            >
              {['IN TRANSIT', 'DELIVERED', 'PENDING', 'CANCELLED', 'RETURNED'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mode"
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              select
            >
              {['Road', 'Air', 'Rail', 'Sea'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consignee"
              name="consignee"
              value={formData.consignee}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Weights and Measurements */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Actual Weight (kg)"
              name="act_weight"
              value={formData.act_weight}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Volume Weight (kg)"
              name="vol_weight"
              value={formData.vol_weight}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Bill Weight (kg)"
              name="bill_weight"
              value={formData.bill_weight}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="POD Details"
              name="pod"
              value={formData.pod}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>

          {/* Submit Button */}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Consignment"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default AddConsignment