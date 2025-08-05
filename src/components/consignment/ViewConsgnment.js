"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Printer, Download } from "lucide-react"
import axios from "axios"

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "delivered": return { bg: "#4caf50", color: "white" }
      case "in transit": return { bg: "#ff9800", color: "white" }
      case "pending": return { bg: "#f44336", color: "white" }
      case "processing": return { bg: "#2196f3", color: "white" }
      default: return { bg: "#9e9e9e", color: "white" }
    }
  }

  const colors = getStatusColor(status)
  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        borderRadius: "8px",
        px: 1,
        py: 0.5
      }}
    />
  )
}

// Detail Item Component
const DetailItem = ({ label, value, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
      {label}
    </Typography>
    {children || (
      <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
        {value || "N/A"}
      </Typography>
    )}
  </Box>
)

function ViewConsignment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consignment, setConsignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchConsignment = async () => {
      try {
        const response = await axios.get(
          `https://namami-infotech.com/ACM/src/consignment/view_consignment.php?id=${id}`
        )
        
        if (response.data.success && response.data.data) {
          setConsignment(response.data.data)
        } else {
          setError("Consignment not found")
        }
      } catch (err) {
        setError("Failed to fetch consignment details")
      } finally {
        setLoading(false)
      }
    }

    fetchConsignment()
  }, [id])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: "#F69320" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/consignments")}
          sx={{ mt: 2 }}
        >
          Back to Consignments
        </Button>
      </Box>
    )
  }

  if (!consignment) return null

  return (
    <Box sx={{ pb: 1, mx: "auto" }}>
      {/* Header with Back Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate("/consignments")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Printer size={18} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
          >
            Download
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit size={18} />}
            onClick={() => navigate(`/edit-consignment/${id}`)}
            sx={{
              backgroundColor: "#F69320",
              "&:hover": {
                backgroundColor: "#e08416",
              },
            }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box elevation={3} sx={{ p: 0, borderRadius: "16px" }}>
        {/* Title Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Consignment #{consignment.airway_billno}
          </Typography>
          <StatusChip status={consignment.status} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Two-Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Basic Information */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DetailItem label="Consignment ID" value={consignment.id} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Vendor Bill No" value={consignment.vairway_billno} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Created Date" value={consignment.dd} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Created Time" value={consignment.dd_time?.split(" ")[1]} />
                </Grid>
              </Grid>
            </Box>

            {/* Client Information */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Client Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DetailItem label="Client Name" value={consignment.client_name} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Client Address" value={consignment.client_address} />
                </Grid>
              </Grid>
            </Box>

            {/* Shipping Details */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Shipping Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DetailItem label="Mode" value={consignment.mode} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Destination" value={consignment.destination} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Expected Delivery" value={consignment.date_exp} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Vendor" value={consignment.vendor_name} />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Status Information */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Status Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DetailItem label="Status Date" value={consignment.status_dt} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Status Time" value={consignment.status_time} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Consignee" value={consignment.consignee} />
                </Grid>
              </Grid>
            </Box>

            {/* Package Details */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Package Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DetailItem label="Quantity" value={consignment.qty} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Charges Qty" value={consignment.charges_qty} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Actual Weight" value={consignment.act_weight} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Volume Weight" value={consignment.vol_weight} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Bill Weight" value={consignment.bill_weight} />
                </Grid>
              </Grid>
            </Box>

            {/* Additional Information */}
            <Box>
              <Typography variant="h6" sx={{ color: "#F69320", mb: 2, fontWeight: 600 }}>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DetailItem label="Remarks">
                    <Box sx={{ 
                      backgroundColor: "#f8fafc", 
                      borderRadius: "8px", 
                      p: 2,
                      borderLeft: "4px solid #F69320"
                    }}>
                      <Typography>{consignment.remarks || "No remarks"}</Typography>
                    </Box>
                  </DetailItem>
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="POD Details">
                    <Box sx={{ 
                      backgroundColor: "#f8fafc", 
                      borderRadius: "8px", 
                      p: 2,
                      borderLeft: "4px solid #F69320"
                    }}>
                      <Typography>{consignment.pod || "No POD details"}</Typography>
                    </Box>
                  </DetailItem>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ViewConsignment