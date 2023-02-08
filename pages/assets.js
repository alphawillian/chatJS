/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-07 19:55:56
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-08 15:21:13
 */
import { useState, useEffect } from "react";
import classnames from "classnames";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import userInfo from './data.js'
import styles from "./assets.module.scss";


export default function MyDialog(props) {
  const [visible, setVisible] = useState(false);
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState([]);
  console.log('userInfo:', userInfo)

  const showModal = () => {
    setVisible(true)
  }
  const closeModal = () => {
    setVisible(false)
  }
  // 进入页面执行
  useEffect(() => {
    async function _() {
      await onSubmit(question1());
      await onSubmit(question2());
    }

    _();
  }, [userInfo])

  const question1 = () => {
    const q1 = `我的投资情况: 资产${userInfo.asset}元，持仓${userInfo.holdProfit >= 0 ? '收益' : '亏损'}${Math.abs(userInfo.holdProfit)}元，近半年交易${userInfo.tradeIn6Months}笔，请给出少于200字的评价。`;
    result.push({
      type: 'user',
      display: false,
      text: q1,
    })
    setResult(result);
    return q1;
  }

  const question2 = () => {
    const q2 = `我是一个${userInfo.riskLevelName}的投资者，当前市场状态，应该投偏股基金还是偏债基金？`;
    result.push({
      type: 'user',
      display: false,
      text: q2,
    })
    setResult(result);
    return q2;
  }

  async function onSubmit(text) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: text,
          userInfo
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      result.push({
        type: 'gpt',
        display: true,
        text: data.result,
      })
      setResult(result);
      console.log(`result: ${JSON.stringify(result)}`);
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
