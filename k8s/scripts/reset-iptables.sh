#!/bin/bash -x

sudo mkdir -p /etc/iptables
sudo iptables-save | sudo tee /etc/iptables/rules.v4.orig > /dev/null   # Save original rules (o ">" sem sudo dava "Permission denied")
sudo iptables -F                                        # Reset all rules
sudo iptables-save | sudo tee -a /etc/iptables/rules.v4 # Persist rules

# ---------------------------------------------------------------------------

sudo /sbin/iptables-restore < /etc/iptables/rules.v4

sudo netfilter-persistent save
sudo systemctl restart iptables