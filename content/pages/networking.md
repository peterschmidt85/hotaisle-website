---
title: Networking
description: Networking
date: '2026-02-05'
---

Networking

* * *

Hot Aisle BGP AS: [21566](https://bgp.tools/as/21566)

Hot Aisle offers flexible networking configuration that we customize for each customer to provide the fastest ethernet standards based cross node communication fabric available today. We are IPv6 first, [VRF networking](https://www.techtarget.com/searchnetworking/definition/virtual-routing-and-forwarding-VRF) and RDMA over Converged _Ethernet_ (_[RoCEv2](https://en.wikipedia.org/wiki/RDMA_over_Converged_Ethernet)_).

*   [Dell XE9680 chassis](/compute/) with 8x [Broadcom 57608 Dual Port 200G Q112 Adapters](https://docs.broadcom.com/doc/NetXtreme-E-PCIENIC-SG) with [Dell PowerSwitch Z9864F](https://www.dell.com/en-us/shop/ipovw/networking-z-series) at 400G. (3200 Gbps ROCEv2 Ethernet)

*   East-West and storage is [Broadcom 57504 Quad Port 10/25GbE Adapters](https://docs.broadcom.com/doc/957504-N425G-DS) with [Dell PowerSwitch Z9664F](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-powerswitch-z9664f-on-spec-sheet.pdf) at 100G.

*   OOB / BMI is [Broadcom 5720 Dual Port 1GbE](https://www.broadcom.com/products/ethernet-connectivity/network-adapters/bcm5720-2p) with [Dell PowerSwitch Z9432F](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-emc-powerswitch-z9432f-spec-sheet.pdf) at 1GbE.

*   100G internet ([Switch Connect](https://www.switch.com/switch-connect/) - [Lumen](https://www.lumen.com/), 40G commit, 100G burst).

*   Public IPv4/v6 address is included on all baremetal and VM servers. You may need to edit ufw config to open ports, which we can help with.

Uptime is critical for you, and for us. All of our switches are backed by a 3-year Dell ProSupport Next Business day warranty. The Z9864F has an additional 4 hour mission critical warranty. We have a parts locker [on site](/datacenter/).

If you would like a specific design, [contact us](mailto:hello@hotaisle.ai), and we will create it for you.

![Dell PowerSwitch Z9864F-ON](https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/wwwnotionso-image-prod-files-secures3us-west-2amazonawscom-286393f4-e9f7-4ee1-936a-dd08d5e664fb-b9a28acb-bdb1-4bfd-8ca0-037e6cbabc76-86f07f19-e7cb-471d-bd3d-43ba6070b1cc_1_201_aheic/public)

Dell PowerSwitch **Z9864F-ON** Spine - [Z9864F-ON Detailed Spec Sheet](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-powerswitch-z9864f-on-spec-sheet.pdf)

![Dell Z9664F-ON](https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/wwwnotionso-image-prod-files-secures3us-west-2amazonawscom-286393f4-e9f7-4ee1-936a-dd08d5e664fb-5962844c-2ef9-4023-bace-5374790f79a0-untitledpng/public)

Dell PowerSwitch Z9664F-ON Spine - [Z9664F-ON Detailed Spec Sheet](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-powerswitch-z9664f-on-spec-sheet.pdf)

![Dell Z9432F-ON](https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/wwwnotionso-image-prod-files-secures3us-west-2amazonawscom-286393f4-e9f7-4ee1-936a-dd08d5e664fb-b29d369e-5b7e-4148-89d8-0bc358bdd60a-untitledpng/public)

Dell PowerSwitch Z9432F-ON Leaf - [Z9432F-ON Detailed Spec Sheet](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-emc-powerswitch-z9432f-spec-sheet.pdf)

[« Data center](https://hotaisle.xyz/datacenter/)[Cluster Design Deploy »](https://hotaisle.xyz/cluster/)
