/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-07 19:55:56
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-08 16:32:35
 */
import { useState, useEffect } from "react";
import classnames from "classnames";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import userInfo from './data.js'
import styles from "./assets.module.scss";


export default function MyDialog(props) {
  const [visible, setVisible] = useState(false);
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState([
    {
      type: 'gpt',
      display: true,
      text: '飞机哦啊见佛大家佛大家佛的撒飞机带搜啊放假哦'
    },
    {
      type: 'gpt',
      display: true,
      text: 'ewqrweqr发动机奥飞骄傲分解到司法局搜打飞机奥飞机哦撒娇佛道撒娇发分解到范德萨范德萨范德萨'
    }
  ]);
  console.log('userInfo:', userInfo)

  const showModal = () => {
    setVisible(true)
  }
  const closeModal = () => {
    setVisible(false)
  }
  // 进入页面执行
  useEffect(() => {
    onSubmit()
  })
  
  async function onSubmit() {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: 'aaaa',
          userInfo
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  // 存储用户和默认回答 到 跳转到聊天页面
  const goChat = () => {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    sessionStorage.setItem('defaultAnswer', JSON.stringify({'answer': result}))
    location.href = './chat'
  }

  return (
    <div className={styles.assetsContainer} >
      <img className={styles.intelligence} onClick={showModal} src="/Artificial intelligence.png" />
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeModal}
        width="80%"
      >
        <Modal.Body>
        {
          result && result
              .filter(item => item.display && item.type === 'gpt')
              .map((item, index) => {
                return <p className={styles.advice} key={index}  >{item.text}</p>
              })
        }
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.gochat} onClick={goChat}>聊一聊</div>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
