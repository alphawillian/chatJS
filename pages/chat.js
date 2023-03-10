/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-07 19:55:56
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-08 19:19:13
 */
import { useState, useEffect } from "react";
import styles from "./chat.module.scss";
import MyDialog from './components/MyDialog'

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [userInfo, setUserInfo] = useState({})

  const quickInputArr = [
    {
      code: '01',
      text: '适合投资吗？'
    }, {
      code: '02',
      text: '什么基金好？'
    }, {
      code: '03',
      text: '可以止盈吗？'
    }, {
      code: '04',
      text: '行情怎么样？'
    }
  ]

  async function onSubmit(event) {
    event.preventDefault();
    result.push({
      type: 'user',
      display: true,
      text: animalInput,
    });
    setResult(result);
    setAnimalInput("");

    // result.push({
    //   type: 'gpt',
    //   display: true,
    //   text: '分解到附近殴打撒附件三',
    // });
    // setTimeout(() => {
    //   setResult([...result]);
    // }, 5000)
    

    return false

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal: animalInput,
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
      });
      setResult(result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  // 进入页面
  useEffect(() => {
    initInfo()
    console.log('进入页面')
  }, [loaded])

  const scrollToTop = () => {
    // 距离顶部的距离
    const vh = document.documentElement.clientHeight
    const dh = document.documentElement.scrollHeight
    const gap = document.documentElement.scrollTop || document.body.scrollTop
    console.log('vh:', vh, 'gap:', gap, document.documentElement)
    window.scrollTo(0, dh - vh - 10);
    
  }
  useEffect(() => {
    scrollToTop()
  }, [result])

  // 初始化用户和默认回答数据
  const initInfo = () => {
    let info = sessionStorage.getItem('userInfo') || '{}'
    info = JSON.parse(info) || {}
    setUserInfo(info)
    let answer = sessionStorage.getItem('defaultAnswer') || '{}'
    answer = JSON.parse(answer)
    setResult(answer.answer)
  }

  const quickInput = (code) => {
    console.log('code:', code)
    let text = ''
    const quickItem = quickInputArr.find((item) => {
      return item.code === code
    })
    console.log('quickItem.text:', quickItem.text)
    setAnimalInput(quickItem.text)
    // switch (code) {
    //   case '01':
    //     break;
    //   case '02':
    //     break;
    // }
  }

  const talkList = () => {
    return (
      result.filter(item => item.display)
            .map(item => {
              return <MyDialog type={item.type} text={item.text} />
            })
    )
  }

  return (
    <div>
      
      <main className={styles.main}>
        {
          result && talkList()
        }
        <div style={{display: 'none'}}>{JSON.stringify(result)}</div>
        <div className={styles.footer}>
          <div className={styles.quickInput}>
            <div className={styles.in}>
              {
                quickInputArr.map((item, index) => {
                  return <button key={index} onClick={() => quickInput(item.code)} >{item.text}</button>
                })
              }
            </div>
          </div>
          <form onSubmit={onSubmit} >
            <input
              type="text"
              name="animal"
              placeholder="您想问什么？"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input type="submit" value="发送" />
          </form>
        </div>
      </main>
    </div>
  );
}
