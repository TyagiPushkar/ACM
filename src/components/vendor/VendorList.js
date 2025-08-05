"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Plus, Search } from 'lucide-react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material"

function VendorList() {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://namami-infotech.com/ACM/src/vendor/vendor_list.php")
        if (response.data.success) {
          setVendors(response.data.data)
          setFilteredVendors(response.data.data)
        } else {
          setError("No vendor data found.")
        }
      } catch (err) {
        setError("Failed to fetch vendor data.")
      } finally {
        setLoading(false)
      }
    }
    fetchVendorData()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = vendors.filter((vendor) => {
      return (
        vendor.id?.toString().toLowerCase().includes(value) ||
        vendor.name?.toLowerCase().includes(value) ||
        vendor.phone?.toLowerCase().includes(value) ||
        vendor.state?.toLowerCase().includes(value) ||
        vendor.city?.toLowerCase().includes(value) ||
        vendor.address?.toLowerCase().includes(value)
      )
    })
    setFilteredVendors(filtered)
    setPage(0)
  }

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
        <CircularProgress sx={{ color: "#F69320" }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading vendor data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Vendor</DialogTitle>
        <DialogContent>
          {selectedVendor && (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <TextField label="Vendor ID" value={selectedVendor.id} disabled />
              <TextField label="Vendor Name" value={selectedVendor.name} onChange={e => setSelectedVendor({ ...selectedVendor, name: e.target.value })} />
              <TextField label="Phone" value={selectedVendor.phone} onChange={e => setSelectedVendor({ ...selectedVendor, phone: e.target.value })} />
              <TextField label="State" value={selectedVendor.state} onChange={e => setSelectedVendor({ ...selectedVendor, state: e.target.value })} />
              <TextField label="City" value={selectedVendor.city} onChange={e => setSelectedVendor({ ...selectedVendor, city: e.target.value })} />
              <TextField label="Address" value={selectedVendor.address} onChange={e => setSelectedVendor({ ...selectedVendor, address: e.target.value })} multiline rows={3} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#F69320" }}
            onClick={async () => {
              try {
                const res = await axios.post("https://namami-infotech.com/ACM/src/vendor/update_vendor.php", selectedVendor)
                if (res.data.success) {
                  alert("Vendor updated successfully")
                  setEditDialogOpen(false)
                  setVendors(prev =>
                      prev.map(v => (v.id === selectedVendor.id ? selectedVendor : v))
                  )
                  setFilteredVendors(prev =>
                    prev.map(v => (v.id === selectedVendor.id ? selectedVendor : v))
                  )
                } else {
                  alert("Update failed: " + res.data.message)
                }
              } catch (err) {
                alert("Error updating vendor.")
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#333">
          Vendor List
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            label="Search vendors"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search size={18} color="#666" style={{ marginRight: "8px" }} />,
            }}
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#F69320",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#F69320",
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/add-vendor")}
            sx={{
              backgroundColor: "#F69320",
              "&:hover": {
                backgroundColor: "#e08416",
              },
            }}
          >
            New Vendor
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TableContainer
            sx={{
              mb: 2,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              width: "100%",
            }}
          >
            <Table size="medium">
              <TableHead sx={{ backgroundColor: "#F69320" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>State</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>City</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                  {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">No vendors found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vendor, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(246, 147, 32, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{vendor.id}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.state}</TableCell>
                      <TableCell>{vendor.city}</TableCell>
                      <TableCell>{vendor.address}</TableCell>
                      {/* <TableCell>
                        <Button size="small" onClick={() => { setSelectedVendor(vendor); setEditDialogOpen(true); }}>
                          Edit
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredVendors.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 25]}
            sx={{
              ".MuiTablePagination-selectIcon": {
                color: "#F69320",
              },
              ".MuiTablePagination-select": {
                fontWeight: 500,
              },
              ".Mui-selected": {
                backgroundColor: "#F69320 !important",
                color: "white",
              },
            }}
          />
        </>
      )}       
    </Box>
  )
}

export default VendorList