import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Form, Button, Alert } from "react-bootstrap";

interface Log {
    level: string,
    ts: string,
    event: string
    [key: string]: any
}

export default function LogTable() {
    const [logs, setLogs] = useState<Log[]>([])
    const [filter, setFilter] = useState("")
    const [status, setStatus] = useState<string | null>(null)

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/logs/')
            
            const formattedLogs = res.data.logs.map(log => ({
                timestamp: log.ts,
                level: log.level,
                service: log.service,
                message: log.event
            }));
            setLogs(formattedLogs)
            setStatus(null)
        } catch(err) {
            setStatus("Erro ao carregar logs")
        }
    }

    const saveLogs = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8001/api/fetch-logs/')
            setStatus(`${res.data.saved} logs salvos no banco`)
        } catch (err) {
            setStatus("Erro ao salvar logs")
        }
    }

    useEffect(() => {
        fetchLogs()
    },[])

    const filtered = filter
        ? logs.filter(log => log.level?.toLocaleLowerCase() === filter.toLocaleLowerCase())
        : logs
    
        return (
            <Container className="mt-4">
                <h3>
                    Logs
                </h3>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Filtrar por nivel
                    </Form.Label>
                    <Form.Select onChange={e => setFilter(e.target.value)}>
                        <option value="">TOTAL</option>
                        <option value="info">INFO</option>
                        <option value="warning">WARNING</option>
                        <option value="error">ERROR</option>
                        <option value="emergency">EMERGENCY</option>
                    </Form.Select>
                </Form.Group>
                
                <Button className="mb-3" onClick={saveLogs}>
                    Salvar Logs
                </Button>

                {status && <Alert variant="info">{status}</Alert>}

                <Table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Nível</th>
                            <th>Evento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((log, index) => (
                            <tr key={index}>
                                <td>{log.timestamp}</td>
                                <td>{log.level}</td>
                                <td>{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        )
}