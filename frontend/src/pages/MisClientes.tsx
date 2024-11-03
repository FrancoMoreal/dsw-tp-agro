import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { Cliente } from '../types/Cliente';
import { Add, Delete, Edit } from '@mui/icons-material';
import NuevoCliente from './NuevoCliente';
import ActualizarCliente from '../components/ActualizarCliente';

const MisClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEdit = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setOpenEditModal(true);
  };

  const handleUpdateCliente = (updatedCliente: Cliente) => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/clientes/${updatedCliente.clienteId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedCliente),
          }
        );
        if (!response.ok) {
          throw new Error('Error al actualizar el cliente');
        }
        fetchClientes();
      } catch (error) {
        setError('Error al actualizar el cliente');
        console.error('Error al actualizar el cliente:', error);
      } finally {
        setOpenEditModal(false);
      }
    })();
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:3000/api/clientes/misClientes',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error al obtener los clientes');
      }
      const data: Cliente[] = await response.json();
      setClientes(data);
    } catch (error) {
      setError('Error al cargar los clientes');
      console.error('Error al cargar los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clienteId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/clientes/${clienteId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al eliminar el cliente');
        }
        // Volver a cargar la lista de clientes
        fetchClientes();
      } catch (error) {
        setError('Error al eliminar el cliente');
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }

  return (
    <TableContainer component={Paper} sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant='h6' component='div'>
          Lista de Clientes
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenModal}
          sx={{ marginRight: 2 }}
        >
          Cliente <Add />
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Localidad</TableCell>
            <TableCell>Provincia</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.clienteId}>
              <TableCell>{cliente.clienteNombre}</TableCell>
              <TableCell>{cliente.clienteEmail}</TableCell>
              <TableCell>{cliente.clienteTelefono}</TableCell>
              <TableCell>{cliente.clienteDireccion}</TableCell>
              <TableCell>{cliente.clienteLocalidad}</TableCell>
              <TableCell>{cliente.clienteProvincia}</TableCell>
              <TableCell>
                <Stack direction='row' spacing={1}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleEdit(cliente)}
                    sx={{
                      minWidth: '40px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleDelete(cliente.clienteId)}
                    sx={{
                      minWidth: '40px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Delete />
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <NuevoCliente
        open={openModal}
        onClose={handleCloseModal}
        onClienteCreado={fetchClientes}
      />
      <ActualizarCliente
        cliente={clienteSeleccionado}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleUpdateCliente}
      />
    </TableContainer>
  );
};

export default MisClientes;