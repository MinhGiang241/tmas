import { StudioSorter } from "@/data/exam";
import { DSort } from "@/data/overview";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

function RenderSortterIcon({ sorter, name }: { sorter: DSort; name?: string }) {
  return name === sorter.id && sorter?.desc === true ? (
    <CaretDownOutlined />
  ) : name === sorter.id && sorter?.desc === false ? (
    <CaretUpOutlined />
  ) : null;
}

export default RenderSortterIcon;
