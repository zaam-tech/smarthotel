export default interface Link {
  alias: string
  active: boolean
  id: string
  icon: string
  iconClass: string
  textClass: string
  text: string
  subMenu?: Array<Partial<Link>>
}
