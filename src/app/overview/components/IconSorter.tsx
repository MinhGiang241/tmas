import { StudioSorter } from "@/data/exam";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

function RenderSortterIcon({
  sorter,
  name,
}: {
  sorter: StudioSorter;
  name?: string;
}) {
  return name === sorter.name && sorter?.isAsc === false ? (
    <CaretDownOutlined />
  ) : name === sorter.name && sorter?.isAsc === true ? (
    <CaretUpOutlined />
  ) : null;
}

export default RenderSortterIcon;
