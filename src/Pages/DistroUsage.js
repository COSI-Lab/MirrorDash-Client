import styled from "styled-components";
import React, { Component } from "react";
import Lokka from "lokka";
import { Transport } from "lokka-transport-http";
import SlideInDiv from "../Components/SlideInDiv";

import ubuntuLogo from "../img/logo/ubuntu-logo32.png";
import blenderlogo from "../img/logo/blender_logo.png";
import linuxmintLogo from "../img/logo/linuxmint_logo.png";
import libreofficeLogo from "../img/logo/libreoffice_logo.png";
import opensuseLogo from "../img/logo/opensuse_logo.jpg";
import centosLogo from "../img/logo/centos_logo.png";
import parrotsecLogo from "../img/logo/parrotsec_logo.png";
import vlcLogo from "../img/logo/vlc_logo.png";
import cygwinLogo from "../img/logo/cygwin_logo.png";
import archlinuxLogo from "../img/logo/archlinux_logo.png";
import debianLogo from "../img/logo/debian_logo.png";
import gnuLogo from "../img/logo/gnu_logo.png";
import ipfireLogo from "../img/logo/ipfire_logo.png";
import manjaroLogo from "../img/logo/manjaro_logo.png";
import sabayonLogo from "../img/logo/sabayon_logo.png";
import slackwareLogo from "../img/logo/slackware_logo.png";
import voidLinuxLogo from "../img/logo/void_logo.png";
import odroidLogo from "../img/logo/odroid_logo.png";
import gpartedLogo from "../img/logo/gparted_logo.png";
import cpanLogo from "../img/logo/cpan_logo.png";
import texLogo from "../img/logo/tex_logo.jpg";
import rLogo from "../img/logo/r_logo.png";
import gentooLogo from "../img/logo/gentoo_logo.png";
import fedoraLogo from "../img/logo/fedora_logo.png";
import isabelleLogo from "../img/logo/isabelle_logo.gif";
import openbsdLogo from "../img/logo/openbsd_logo.png";
import rosLogo from "../img/logo/ros_logo.png";
import linuxLogo from "../img/logo/linux_logo.png";
import clonezillaLogo from "../img/logo/clonezilla_logo.jpg";
import raspbianLogo from "../img/logo/raspbian_logo.png";
import freebsdLogo from "../img/logo/freebsd_logo.png";
import slitazLogo from "../img/logo/slitaz_logo.png";

import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";

import ReactGridLayout from "react-grid-layout";

import { minimizeBytes } from "../util";

const client = new Lokka({
  transport: new Transport("http://localhost:4000/graphql")
});

const distroImages = {
  blender: blenderlogo,
  ubuntu: ubuntuLogo,
  linuxmint: linuxmintLogo,
  tdf: libreofficeLogo,
  opensuse: opensuseLogo,
  centos: centosLogo,
  "ubuntu-releases": ubuntuLogo,
  parrot: parrotsecLogo,
  videolan: vlcLogo,
  cygwin: cygwinLogo,
  archlinux: archlinuxLogo,
  debian: debianLogo,
  manjaro: manjaroLogo,
  sabayon: sabayonLogo,
  ipfire: ipfireLogo,
  voidlinux: voidLinuxLogo,
  gnu: gnuLogo,
  slackware: slackwareLogo,
  "debian-cd": debianLogo,
  "debian-security": debianLogo,
  "ubuntu-ports": ubuntuLogo,
  "ubuntu-cdimage": ubuntuLogo,
  odroid: odroidLogo,
  gparted: gpartedLogo,
  cpan: cpanLogo,
  ctan: texLogo,
  cran: rLogo,
  gentoo: gentooLogo,
  "gentoo-portage": gentooLogo,
  fedora: fedoraLogo,
  "fedora-epel": fedoraLogo,
  isabelle: isabelleLogo,
  openbsd: openbsdLogo,
  ros: rosLogo,
  linux: linuxLogo,
  clonezilla: clonezillaLogo,
  raspbian: raspbianLogo,
  freebsd: freebsdLogo,
  slitaz: slitazLogo
};

const DistroContainer = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* justify-content: space-between; */
  align-items: center;
  padding: 10px;
  height: 40px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 30px;
    text-align: left;
  }

  span {
    font-size: 20px;
  }

  img {
    height: auto;
    width: 120px;
  }
`;

const Distro = props => {
  const { distro, bytes } = props.distro;
  return (
    <DistroContainer style={props.style} key={props.key}>
      <img
        src={distroImages[distro]}
        alt="logo"
        style={{
          position: "relative",
          top: "0px",
          paddingRight: 20
        }}
      />
      <div>
        <h3>{distro}</h3>
        <span>{minimizeBytes(bytes)}</span>
      </div>
      {/* <h3>
        {props.num}: {distro}
      </h3>

      <span>{minimizeBytes(bytes)}</span> */}
    </DistroContainer>
  );
};

class DistroUsage extends Component {
  constructor(props) {
    super(props);
    this.state = { distrousage: null };
    this.getData();
  }

  getData() {
    client
      .query(
        `
          {
            distrousage(lastDays: 1, sortBiggest: true) {
              date
              distro
              bytes
              GB
            }
          }
        `
      )
      .then(({ distrousage }) => {
        this.setState(prevState => {
          return { distrousage };
        });
      });
  }

  render() {
    return (
      <SlideInDiv>
        <h2
          style={{
            marginLeft: 30,
            marginBottom: -20,
            color: "#4b4b4b",
            fontSize: "100%"
          }}
        >
          Daily Distro Stats
        </h2>
        {this.state.distrousage && (
          <ReactGridLayout
            className="layout"
            cols={3}
            rowHeight={100}
            width={1200}
            margin={[30, 30]}
            isResizable={false}
            isDraggable={false}
          >
            {this.state.distrousage.map((distro, x) => (
              <Distro
                num={x + 1}
                distro={distro}
                key={x}
                data-grid={{ x: x % 3, y: Math.ceil(x / 3), w: 1, h: 1 }}
                logo={ubuntuLogo}
              />
            ))}
          </ReactGridLayout>
        )}
      </SlideInDiv>
    );
  }
}

export default DistroUsage;
