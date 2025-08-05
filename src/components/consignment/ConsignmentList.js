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
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Chip,
  Fade,
  Slide,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  Skeleton,
  Pagination,
  Grid,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Eye, Edit, Delete, Package, TrendingUp } from "lucide-react"

// Styled components for modern UI
const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  background: "white",
  "& .MuiTable-root": {
    minWidth: 650,
  },
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(135deg, #F69320 0%, #FF8A50 100%)",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: "bold",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "none",
    padding: theme.spacing(2),
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(246, 147, 32, 0.02)",
  },
  "&:hover": {
    backgroundColor: "rgba(246, 147, 32, 0.08)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease-in-out",
  },
  transition: "all 0.2s ease-in-out",
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "8px",
  padding: "8px",
  margin: "0 2px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}))

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 16px rgba(246, 147, 32, 0.2)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#F69320",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#F69320",
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 16px rgba(246, 147, 32, 0.3)",
  background: "linear-gradient(135deg, #F69320 0%, #FF8A50 100%)",
  "&:hover": {
    background: "linear-gradient(135deg, #e08416 0%, #e67a45 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(246, 147, 32, 0.4)",
  },
  transition: "all 0.2s ease-in-out",
}))

const StatusChip = styled(Chip)(({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "delivered":
        return { bg: "#4caf50", color: "white" }
      case "in transit":
        return { bg: "#ff9800", color: "white" }
      case "pending":
        return { bg: "#f44336", color: "white" }
      case "processing":
        return { bg: "#2196f3", color: "white" }
      default:
        return { bg: "#9e9e9e", color: "white" }
    }
  }

  const colors = getStatusColor(status)
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    borderRadius: "8px",
    "& .MuiChip-label": {
      padding: "4px 12px",
    },
  }
})

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    borderRadius: "8px",
    fontWeight: 600,
    "&.Mui-selected": {
      backgroundColor: "#F69320",
      color: "white",
      "&:hover": {
        backgroundColor: "#e08416",
      },
    },
    "&:hover": {
      backgroundColor: "rgba(246, 147, 32, 0.1)",
    },
  },
}))

function ConsignmentList() {
  const [consignments, setConsignments] = useState([])
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1) // 1-based for API
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedConsignment, setSelectedConsignment] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [consignmentToDelete, setConsignmentToDelete] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const navigate = useNavigate()

  const fetchConsignmentData = async (currentPage = page, currentRowsPerPage = rowsPerPage, search = searchTerm) => {
    setLoading(currentPage === 1 && search === searchTerm)
    setSearchLoading(search !== searchTerm)

    try {
      const response = await axios.get(
        `https://namami-infotech.com/ACM/src/consignment/get_consignment.php?page=${currentPage}&limit=${currentRowsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      )

      if (response.data.success) {
        setConsignments(response.data.data || [])
        setPagination(
          response.data.pagination || {
            totalRecords: response.data.data?.length || 0,
            currentPage: currentPage,
            limit: currentRowsPerPage,
            totalPages: Math.ceil((response.data.data?.length || 0) / currentRowsPerPage),
          },
        )
        setError("")
      } else {
        setError(response.data.message || "No consignment data found.")
        setConsignments([])
        setPagination({
          totalRecords: 0,
          currentPage: 1,
          limit: currentRowsPerPage,
          totalPages: 0,
        })
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to fetch consignment data.")
      setConsignments([])
      setPagination({
        totalRecords: 0,
        currentPage: 1,
        limit: currentRowsPerPage,
        totalPages: 0,
      })
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    fetchConsignmentData()
  }, [page, rowsPerPage])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== undefined) {
        setPage(1) // Reset to first page when searching
        fetchConsignmentData(1, rowsPerPage, searchTerm)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, rowsPerPage])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number.parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(1) // Reset to first page
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.post("https://namami-infotech.com/ACM/src/consignment/delete_consignment.php", {
        id,
      })

      if (response.data.success) {
        // Refresh current page data
        await fetchConsignmentData()
        setDeleteDialogOpen(false)
        setConsignmentToDelete(null)
      } else {
        setError("Failed to delete consignment")
      }
    } catch (err) {
      console.error("Delete error:", err)
      setError("Error deleting consignment")
    }
  }

  const LoadingSkeleton = () => (
    <TableRow>
      {Array.from({ length: 12 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width="100%" height={20} />
        </TableCell>
      ))}
    </TableRow>
  )

  if (loading && consignments.length === 0) {
    return (
      <Fade in={loading}>
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "#F69320",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Typography variant="h6" sx={{ mt: 3, color: "#666", fontWeight: 500 }}>
            Loading consignment data...
          </Typography>
        </Box>
      </Fade>
    )
  }

  return (
    <Box sx={{ p: 0, minHeight: "100vh" }}>
      {/* Header Card */}
      

      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#333">
          Consignment List
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <SearchTextField
            label="Search consignments"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {searchLoading ? (
                    <CircularProgress size={18} sx={{ color: "#F69320" }} />
                  ) : (
                    <Search size={18} color="#666" />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <ActionButton variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate("/add-consignment")}>
            New Consignment
          </ActionButton>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Slide direction="down" in={!!error}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(244, 67, 54, 0.1)",
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        </Slide>
      )}

      {/* Pagination Info */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="textSecondary">
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, pagination.totalRecords)} of{" "}
          {pagination.totalRecords} entries
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="textSecondary">
            Rows per page:
          </Typography>
          <TextField
            select
            size="small"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            SelectProps={{
              native: true,
            }}
            sx={{ minWidth: 80 }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </TextField>
        </Box>
      </Box>

      {/* Table */}
      <StyledTableContainer component={Paper}>
        <Table size="medium">
          <StyledTableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell>Airway Bill No</TableCell>
              <TableCell>Vendor Bill No</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Pick Up Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Status Date</TableCell>
              <TableCell>Status Time</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Vendor Name</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading && consignments.length > 0 ? (
              Array.from({ length: 3 }).map((_, index) => <LoadingSkeleton key={index} />)
            ) : consignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                  <Package size={48} color="#ccc" />
                  <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                    No consignments found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {searchTerm ? "Try adjusting your search terms" : "Start by adding a new consignment"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              consignments.map((consignment, index) => (
                <StyledTableRow key={consignment.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="View Details">
                        <StyledIconButton
  size="small"
  onClick={() => navigate(`/view-consignment/${consignment.id}`)}
  sx={{ color: "#1976d2" }}
>
  <Eye size={16} />
</StyledIconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <StyledIconButton
                          size="small"
                          onClick={() => navigate(`/edit-consignment/${consignment.id}`)}
                          sx={{ color: "#F69320" }}
                        >
                          <Edit size={16} />
                        </StyledIconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <StyledIconButton
                          size="small"
                          onClick={() => {
                            setConsignmentToDelete(consignment.id)
                            setDeleteDialogOpen(true)
                          }}
                          sx={{ color: "#f44336" }}
                        >
                          <Delete size={16} />
                        </StyledIconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, fontFamily: "monospace" }}>{consignment.airway_billno}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>{consignment.vairway_billno}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{consignment.client_name}</TableCell>
                  <TableCell>{consignment.dd}</TableCell>
                  <TableCell>
                    <StatusChip label={consignment.status.trim()} size="small" status={consignment.status} />
                  </TableCell>
                  <TableCell>{consignment.status_dt}</TableCell>
                  <TableCell>{consignment.status_time}</TableCell>
                  <TableCell>
                    <Chip label={consignment.mode} size="small" variant="outlined" sx={{ borderRadius: "8px" }} />
                  </TableCell>
                  <TableCell>{consignment.destination}</TableCell>
                  <TableCell>{consignment.vendor_name}</TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Enhanced Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={3}>
        <Typography variant="body2" color="textSecondary">
          Page {pagination.currentPage} of {pagination.totalPages}
        </Typography>

        <StyledPagination
          count={pagination.totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          siblingCount={2}
          boundaryCount={1}
        />

        <Typography variant="body2" color="textSecondary">
          Total: {pagination.totalRecords.toLocaleString()} records
        </Typography>
      </Box>

  



      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#f44336", fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this consignment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false)
              setConsignmentToDelete(null)
            }}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(consignmentToDelete)}
            color="error"
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ConsignmentList
