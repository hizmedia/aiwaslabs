import { Text } from "@medusajs/ui"
import Image from "next/image"
import Medusa from "../../../common/icons/medusa"

const MedusaCTA = () => {
  return (
    <Text>   
      <a href="https://www.hizmedia.com" target="_blank" rel="noreferrer" className="flex gap-x-2 txt-compact-small-plus items-center">
      Powered by
        <Image
          src="https://res.cloudinary.com/dky6bti4g/image/upload/v1753113040/Logo_h08daj.png"
          alt="Hizmedia Logo"
          width={30}
          height={30}
          className="object-contain"
        />
      </a>
    </Text>
  )
}

export default MedusaCTA
