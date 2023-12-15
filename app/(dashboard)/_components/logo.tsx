import Image from "next/image"

const Logo = () => {
    return (
        <Image width={50} height={50} alt={`logo`} src="/logo.png"/>
    )
}
export default Logo