import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import React from "react";

interface Props extends BaseModalProps {}

function AllCodeModal(props: Props) {
  return <BaseModal {...props}>AllCodeModal</BaseModal>;
}

export default AllCodeModal;
