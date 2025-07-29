package main
import (
  "encoding/json"
  "fmt"
  "net/http"
)

const secret = "mysecret"

func webhookHandler(w http.ResponseWriter, r *http.Request) {
  if r.Header.Get("X-Webhook-Secret") != secret {
    http.Error(w, "unauthorized", http.StatusUnauthorized)
    return
  }
  var data map[string]interface{}
  json.NewDecoder(r.Body).Decode(&data)
  fmt.Println("Received:", data)
  w.WriteHeader(http.StatusOK)
}

func main() {
  http.HandleFunc("/webhook", webhookHandler)
  http.ListenAndServe(":8080", nil)
}