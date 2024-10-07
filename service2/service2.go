package main

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"strings"
)

type SystemInfo struct {
	IPAddress  string `json:"ip_address"`
	Processes  string `json:"processes"`
	DiskSpace  string `json:"disk_space"`
	Uptime     string `json:"uptime"`
}

func getSystemInfo() SystemInfo {
	ipAddress := execCommand("hostname", "-i")
	processes := execCommand("ps", "-ax")
	diskSpace := execCommand("df", "-hP", "/")
	uptime := execCommand("uptime", "-p")

	return SystemInfo{
		IPAddress:  strings.TrimSpace(ipAddress),
		Processes:  processes,
		DiskSpace:  diskSpace,
		Uptime:     strings.TrimSpace(uptime),
	}
}

func execCommand(name string, arg ...string) string {
	out, _ := exec.Command(name, arg...).Output()
	return string(out)
}

func handler(w http.ResponseWriter, r *http.Request) {
	info := getSystemInfo()
	json.NewEncoder(w).Encode(info)
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":5001", nil)
}

