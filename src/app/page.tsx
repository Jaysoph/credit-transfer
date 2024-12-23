"use client"

import { Box, Image, Img, Input } from "@chakra-ui/react"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import useMutateLogin from "@/feature/authentication/hooks/useMutateLogin"
import { ITokenPayload } from "@/feature/authentication/interface/auth"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import useProfileStore, { selectOnsetProfileData } from "@/stores/profileStore"
import Homepage from "../asset/image/page1.jpg"
import { onRemoveCookie } from "@/configs/handleCookie"
interface IProps {
  username: string
  password: string
}

export default function Home() {
  const router = useRouter()
  const [login, setLogin] = useState<IProps>({
    username: "",
    password: ""
  })
  const { onLogin } = useMutateLogin()
  const setData = useProfileStore(selectOnsetProfileData)
  const decodeToken = (token: string): ITokenPayload | null => {
    try {
      const decoded: ITokenPayload = jwtDecode<ITokenPayload>(token)
      return decoded
    } catch (error) {
      console.error("Invalid token", error)
      return null
    }
  }

  const handleLogin = async () => {
    const loginToken = await onLogin(login)
    if (loginToken) {
      const decodeData = decodeToken(loginToken)
      if (decodeData) {
        setData(decodeData)
      }
      onRemoveCookie()
      Cookies.set("accessToken", loginToken)
      router.push("/transfer")
    }
  }

  const handleLoginChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setLogin((prevValue) => ({
      ...prevValue,
      [field]: e.target.value
    }))
  }

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      paddingX={{ lg: "120px", xl: "240px" }}
      paddingY={{ lg: "90px", xl: "180px" }}
      background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
    >
      <Box
        width="100%"
        height="100%"
        background="linear-gradient(356deg, rgba(180,231,229,1) 0%, rgba(246,246,246,1) 19%, rgba(242,247,247,1) 100%)"
        borderRadius="16px"
        borderWidth={2}
        borderColor="black"
      >
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          height="100%"
        >
          <Box width={{ lg: "60%", xl: "65%" }}>
            <Img
              width="100%"
              height="100%"
              backgroundSize="cover"
              borderTopLeftRadius={16}
              borderBottomLeftRadius={16}
              src="https://credit-transferz2.s3.ap-southeast-1.amazonaws.com/img/page1.jpg"
              alt="Homepage"
            />
          </Box>
          <Box
            width={{ lg: "40%", xl: "35%" }}
            height="100%"
            flexDirection="column"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="24px"
          >
            <Box
              whiteSpace="pre-wrap"
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              ระบบเทียบโอนรายวิชาศึกษาทั่วไป
            </Box>
            <Box
              whiteSpace="pre-wrap"
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              (ระดับ ปวส.)
            </Box>
            <Box
              fontSize={{ lg: "18px", xl: "30px" }}
              fontWeight={{ lg: 700, xl: "normal" }}
            >
              มหาวิทยาลัยหอการค้าไทย
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              gap="24px"
            >
              <Input
                type="text"
                value={login.username}
                onChange={(e) => handleLoginChange(e, "username")}
                placeholder="ชื่อผู้ใช้งาน"
                borderWidth="2px"
                borderColor="black"
              />
              <TextField
                type="password"
                value={login.password}
                onChange={(e) => handleLoginChange(e, "password")}
                placeholder="รหัสผ่าน"
              />
              <Button
                borderRadius={8}
                backgroundColor="#0C388E"
                color="white"
                label={"เข้าสู่ระบบ"}
                onClick={handleLogin}
              ></Button>
              <Button
                borderRadius={8}
                backgroundColor="grey"
                color="white"
                label={"เข้าสู่ระบบแบบผู้เยี่ยมชม"}
                onClick={() => {
                  router.push(`/transfer`)
                }}
              ></Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        width="100%"
        background=" linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
        position="absolute"
        bottom="0px"
        left="0px"
        justifyContent="center"
        fontWeight={700}
        color="black"
      >
        พัฒนาโดย นายโจเซฟ เฉิน ,นายโจนาธาน เฉิน สาขาวิทยาการคอมพิวเตอร์
        คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยหอการค้าไทย
      </Box>
    </Box>
  )
}
