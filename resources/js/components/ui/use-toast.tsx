import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastActionElement = React.ReactElement<typeof ToastAction>

type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "success" | "info" | "warning" | "destructive"
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, action, variant = "default", ...props }, ref) => {
    // Function to format description with line breaks
    const formatDescription = (desc: string | undefined) => {
      if (!desc) return null;
      
      return desc.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < desc.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
          {
            "bg-white text-foreground": variant === "default",
            "bg-green-100 border-green-200 text-green-900": variant === "success",
            "bg-blue-100 border-blue-200 text-blue-900": variant === "info",
            "bg-yellow-100 border-yellow-200 text-yellow-900": variant === "warning",
            "bg-red-100 border-red-200 text-red-900": variant === "destructive",
          },
          className
        )}
        {...props}
      >
        <div className="grid gap-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {description && (
            <p className="text-sm opacity-90">{formatDescription(description)}</p>
          )}
        </div>
        {action}
        <button
          onClick={() => document.dispatchEvent(
            new CustomEvent("toast-remove", { detail: { toastId: props.id } })
          )}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    )
  }
)
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

type ToastInfo = {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "success" | "info" | "warning" | "destructive"
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const ToastContext = React.createContext<{
  toasts: ToastInfo[]
  addToast: (toast: Omit<ToastInfo, "id">) => void
  removeToast: (id: string) => void
  removeAllToasts: () => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  removeAllToasts: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastInfo[]>([])

  const addToast = React.useCallback(
    (toast: Omit<ToastInfo, "id">) => {
      setToasts((prevToasts) => {
        const id = crypto.randomUUID()
        const newToast = { ...toast, id }

        // Set a timeout to remove the toast
        toastTimeouts.set(
          id,
          setTimeout(() => {
            removeToast(id)
          }, TOAST_REMOVE_DELAY)
        )

        return [...prevToasts, newToast].slice(-TOAST_LIMIT)
      })
    },
    [setToasts]
  )

  const removeToast = React.useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))

      // Clear the timeout for this toast
      if (toastTimeouts.has(id)) {
        clearTimeout(toastTimeouts.get(id))
        toastTimeouts.delete(id)
      }
    },
    [setToasts]
  )

  const removeAllToasts = React.useCallback(() => {
    setToasts([])

    // Clear all timeouts
    toastTimeouts.forEach((timeout) => clearTimeout(timeout))
    toastTimeouts.clear()
  }, [setToasts])

  // Listen for toast-remove events
  React.useEffect(() => {
    const handleRemoveToast = (event: CustomEvent<{ toastId: string }>) => {
      removeToast(event.detail.toastId)
    }

    document.addEventListener("toast-remove", handleRemoveToast as EventListener)

    return () => {
      document.removeEventListener("toast-remove", handleRemoveToast as EventListener)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, removeAllToasts }}
    >
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
    dismissAll: context.removeAllToasts,
  }
}

export function Toaster() {
  const { toasts } = React.useContext(ToastContext)

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          variant={toast.variant}
          className="mb-2"
        />
      ))}
    </div>
  )
}

export { ToastAction, Toast }
