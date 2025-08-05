"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
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

function ClientList() {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://namami-infotech.com/ACM/src/client/client_list.php")
        if (response.data.success) {
          setClients(response.data.data)
          setFilteredClients(response.data.data)
        } else {
          setError("No client data found.")
        }
      } catch (err) {
        setError("Failed to fetch client data.")
      } finally {
        setLoading(false)
      }
    }
    fetchClientData()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = clients.filter((client) => {
      return (
        client.id?.toString().toLowerCase().includes(value) ||
        client.name?.toLowerCase().includes(value) ||
        client.phone?.toLowerCase().includes(value) ||
        client.email?.toLowerCase().includes(value) ||
        client.gst_num?.toLowerCase().includes(value) ||
            client.pincode?.toLowerCase().includes(value)
      )
    })
    setFilteredClients(filtered)
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
          Loading client data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <TextField label="Client ID" value={selectedClient.id} disabled />
              <TextField label="Client Name" value={selectedClient.name} onChange={e => setSelectedClient({ ...selectedClient, name: e.target.value })} />
              <TextField label="Phone" value={selectedClient.phone} onChange={e => setSelectedClient({ ...selectedClient, phone: e.target.value })} />
              <TextField label="Email" value={selectedClient.email} onChange={e => setSelectedClient({ ...selectedClient, email: e.target.value })} />
              <TextField label="Address" value={selectedClient.address} onChange={e => setSelectedClient({ ...selectedClient, address: e.target.value })} multiline rows={3} />
              <TextField label="Pincode" value={selectedClient.pincode} onChange={e => setSelectedClient({ ...selectedClient, pincode: e.target.value })} />
              <TextField label="Billing Name" value={selectedClient.billing_nm || ''} onChange={e => setSelectedClient({ ...selectedClient, billing_nm: e.target.value })} />
              <TextField label="GST Number" value={selectedClient.gst_num || ''} onChange={e => setSelectedClient({ ...selectedClient, gst_num: e.target.value })} />
              <TextField label="Billing Address" value={selectedClient.billing_address || ''} onChange={e => setSelectedClient({ ...selectedClient, billing_address: e.target.value })} multiline rows={3} />
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
                const res = await axios.post("https://namami-infotech.com/ACM/src/client/update_client.php", selectedClient)
                if (res.data.success) {
                  alert("Client updated successfully")
                  setEditDialogOpen(false)
                  setClients(prev =>
                    prev.map(c => (c.id === selectedClient.id ? selectedClient : c))
                  )
                  setFilteredClients(prev =>
                    prev.map(c => (c.id === selectedClient.id ? selectedClient : c))
                  )
                } else {
                  alert("Update failed: " + res.data.message)
                }
              } catch (err) {
                alert("Error updating client.")
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#333">
          Client List
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            label="Search clients"
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
            onClick={() => navigate("/add-new-client")}
            sx={{
              backgroundColor: "#F69320",
              "&:hover": {
                backgroundColor: "#e08416",
              },
            }}
          >
            New Client
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                  {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell> */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pincode</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>GST Number</TableCell>
                  {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">No clients found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(246, 147, 32, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      {/* <TableCell>{client.address}</TableCell> */}
                      <TableCell>{client.pincode}</TableCell>
                      <TableCell>{client.gst_num || '-'}</TableCell>
                      {/* <TableCell>
                        <Button size="small" onClick={() => { setSelectedClient(client); setEditDialogOpen(true); }}>
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
            count={filteredClients.length}
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

export default ClientList