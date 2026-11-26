# Endereços antigos (um bloco de resource por porta) -> for_each atual de load-balancing.tf.
# Só renomeia no state: nada é recriado. Pode ser apagado quando nenhum state antigo
# (de antes desta mudança) precisar mais ser aplicado.

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_80
  to   = oci_network_load_balancer_backend_set.worker["tcp_80"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_80
  to   = oci_network_load_balancer_listener.worker["tcp_80"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_80["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_80-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_80["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_80-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_80["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_80-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_443
  to   = oci_network_load_balancer_backend_set.worker["tcp_443"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_443
  to   = oci_network_load_balancer_listener.worker["tcp_443"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_443["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_443-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_443["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_443-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_443["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_443-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_udp_1700
  to   = oci_network_load_balancer_backend_set.worker["udp_1700"]
}
moved {
  from = oci_network_load_balancer_listener.worker_udp_1700
  to   = oci_network_load_balancer_listener.worker["udp_1700"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1700["0"]
  to   = oci_network_load_balancer_backend.worker["udp_1700-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1700["1"]
  to   = oci_network_load_balancer_backend.worker["udp_1700-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1700["2"]
  to   = oci_network_load_balancer_backend.worker["udp_1700-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_udp_1710
  to   = oci_network_load_balancer_backend_set.worker["udp_1710"]
}
moved {
  from = oci_network_load_balancer_listener.worker_udp_1710
  to   = oci_network_load_balancer_listener.worker["udp_1710"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1710["0"]
  to   = oci_network_load_balancer_backend.worker["udp_1710-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1710["1"]
  to   = oci_network_load_balancer_backend.worker["udp_1710-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_udp_1710["2"]
  to   = oci_network_load_balancer_backend.worker["udp_1710-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_1888
  to   = oci_network_load_balancer_backend_set.worker["tcp_1888"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_1888
  to   = oci_network_load_balancer_listener.worker["tcp_1888"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1888["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_1888-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1888["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_1888-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1888["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_1888-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_8883
  to   = oci_network_load_balancer_backend_set.worker["tcp_8883"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_8883
  to   = oci_network_load_balancer_listener.worker["tcp_8883"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_8883["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_8883-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_8883["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_8883-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_8883["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_8883-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_1883
  to   = oci_network_load_balancer_backend_set.worker["tcp_1883"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_1883
  to   = oci_network_load_balancer_listener.worker["tcp_1883"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1883["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_1883-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1883["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_1883-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1883["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_1883-2"]
}

moved {
  from = oci_network_load_balancer_backend_set.worker_tcp_1884
  to   = oci_network_load_balancer_backend_set.worker["tcp_1884"]
}
moved {
  from = oci_network_load_balancer_listener.worker_tcp_1884
  to   = oci_network_load_balancer_listener.worker["tcp_1884"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1884["0"]
  to   = oci_network_load_balancer_backend.worker["tcp_1884-0"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1884["1"]
  to   = oci_network_load_balancer_backend.worker["tcp_1884-1"]
}
moved {
  from = oci_network_load_balancer_backend.worker_tcp_1884["2"]
  to   = oci_network_load_balancer_backend.worker["tcp_1884-2"]
}
