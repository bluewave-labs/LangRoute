/**
 * @fileoverview Real-time logs viewer component for the LangRoute application.
 * Displays API request logs with live updates and pagination support.
 */

"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

/**
 * Represents a single API log entry.
 * @typedef {Object} Log
 * @property {string} timestamp - ISO timestamp of when the request was made
 * @property {string} method - HTTP method used (GET, POST, etc.)
 * @property {string} endpoint - API endpoint that was called
 * @property {string} status - HTTP status code of the response
 * @property {number} duration_ms - Request duration in milliseconds
 * @property {string} model - LLM model used (e.g., 'gpt-3.5-turbo')
 * @property {string} provider - LLM provider (e.g., 'openai')
 * @property {number} inputTokens - Number of input tokens used
 * @property {number} outputTokens - Number of output tokens generated
 * @property {number} totalCost - Total cost of the API call in USD
 */
type Log = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  duration_ms: number;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
};

/**
 * LogsPage component that displays real-time API logs with pagination and live updates.
 * Features:
 * - Real-time log updates every 5 seconds
 * - Incremental updates to minimize data transfer
 * - Pagination with configurable page size
 * - Connection status indicator
 * - Sorting by timestamp (newest first)
 * 
 * @returns {JSX.Element} The rendered logs page component
 */
export default function LogsPage() {
  /** All API logs, sorted by timestamp (newest first) */
  const [logs, setLogs] = useState<Log[]>([]);
  
  /** Number of logs to display per page */
  const [pageSize, setPageSize] = useState<number>(10);
  
  /** Current page number (1-based) */
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  /** Whether the app is connected to the API server */
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  /** Current loading state of the logs data */
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success'>('idle');
  
  /** Timestamp of the most recent log, used for incremental updates */
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);

  /** Total number of pages based on current page size */
  const totalPages = Math.ceil(logs.length / pageSize);
  
  /** Starting index for the current page */
  const startIndex = (currentPage - 1) * pageSize;
  
  /** Ending index for the current page */
  const endIndex = startIndex + pageSize;
  
  /** Logs to display on the current page */
  const currentLogs = loadingState === 'loading' ? [] : logs.slice(startIndex, endIndex);

  /**
   * Fetches logs from the API with support for incremental updates.
   * On initial fetch, shows loading state and fetches all logs.
   * On subsequent fetches, only retrieves logs newer than the last timestamp.
   *
   * @param {boolean} isInitialFetch - Whether this is the first fetch (default: false)
   * @returns {Promise<void>}
   */
  const fetchLogs = async (isInitialFetch: boolean = false): Promise<void> => {
    if (!isConnected) setIsConnected(true);
    if (loadingState === 'loading') return;
    
    // Only show loading state on initial fetch
    if (isInitialFetch) {
      setLoadingState('loading');
    }
    
    try {
      const url = new URL('/api/logs', window.location.origin);
      url.searchParams.set('limit', pageSize.toString());
      if (!isInitialFetch && lastTimestamp) {
        url.searchParams.set('lastTimestamp', lastTimestamp);
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data && Array.isArray(data.logs)) {
        if (data.logs.length > 0) {
          if (isInitialFetch) {
            setLogs(data.logs);
          } else {
            // Merge new logs with existing logs:
            // 1. Filter out duplicates based on timestamp
            // 2. Sort by timestamp (newest first)
            // 3. Maintain pagination state
            setLogs(prevLogs => {
              const newLogs = data.logs.filter((newLog: Log) => 
                !prevLogs.some(existingLog => 
                  existingLog.timestamp === newLog.timestamp
                )
              );
              return [...newLogs, ...prevLogs].sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              );
            });
          }
          // Update last timestamp for next fetch
          if (data.logs[0]) {
            setLastTimestamp(data.logs[0].timestamp);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      if (isInitialFetch) {
        setLogs([]);
      }
    } finally {
      if (isInitialFetch) {
        setTimeout(() => {
          setLoadingState('success');
        }, 300);
      }
    }
  };

  /**
   * Effect hook to handle initial data fetch and polling.
   * - Performs initial fetch with loading state
   * - Sets up polling every 5 seconds for incremental updates
   * - Cleans up polling interval on unmount
   */
  useEffect(() => {
    // Initial fetch with loading state
    fetchLogs(true);
    
    // Set up polling for incremental updates
    const interval = setInterval(() => fetchLogs(false), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-3 h-3">
              <div className={`absolute w-full h-full rounded-full ${isConnected ? 'bg-green-500 animate-ping' : 'bg-yellow-500'} opacity-75`}></div>
              <div className={`absolute w-full h-full rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
            <h1 className="text-lg font-medium">
              {isConnected ? 'Your LangRoute LLM gateway is running properly' : 'Connecting to LangRoute LLM gateway...'}
            </h1>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6" style={{ backgroundColor: '#F9FAFB' }}>
            <h2 className="text-lg font-medium tracking-tight">Real-time Logs</h2>
            <p className="text-sm text-muted-foreground mt-2">Live monitoring of API requests through LangRoute</p>
          </div>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="border-b" style={{ backgroundColor: '#F9FAFB' }}>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Model/Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tokens (In/Out)</TableHead>
                  <TableHead>Cost ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingState === 'loading' ? (
                  // Show loading skeleton with a fade-in effect
                  Array(pageSize).fill(null).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell colSpan={8}>
                        <div 
                          className="h-[42px] animate-pulse rounded bg-gray-100/50 transition-opacity duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        ></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : currentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">📝</span>
                        <span className="text-sm text-muted-foreground">No logs available yet</span>
                        <span className="text-xs text-muted-foreground">Make an API request to see it appear here</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{log.method}</TableCell>
                      <TableCell>{log.endpoint}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{log.model}</span>
                          <span className="text-xs text-muted-foreground capitalize">{log.provider.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.status.startsWith("2") 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{log.duration_ms.toLocaleString()}ms</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="text-blue-600">{log.inputTokens.toLocaleString()} in</span>
                          <span className="text-purple-600">{log.outputTokens.toLocaleString()} out</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-emerald-600">
                          ${log.totalCost.toFixed(6)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 flex items-center justify-between border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value: string) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 text-sm">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
