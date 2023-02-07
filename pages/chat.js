/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-07 19:55:56
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-07 20:42:08
 */
import Head from "next/head";
import { useState } from "react";
import styles from "./chat.module.scss";
import MyDialog from './components/MyDialog'

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      
      <main className={styles.main}>
        <MyDialog type={'user'}/>
        <MyDialog type={'gpt'}/>
        <form onSubmit={onSubmit} className={styles.footer}>
          <input
            type="text"
            name="animal"
            placeholder="您想问什么？"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="发送" />
        </form>
      </main>
    </div>
  );
}
