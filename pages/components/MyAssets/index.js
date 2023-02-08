/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-07 19:55:56
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-08 18:03:35
 */
import { useState } from "react";
import classnames from "classnames";
import styles from "./index.module.scss";

export default function MyAssets(props) {
  const [userInfo, setUserInfo] = useState(props.userInfo || {})

  return (
    <div>
      <main className={classnames(styles.main)}>
        <div className={styles.top}>
          <div className={styles.line1}>
            <div className={styles.text}>资产(元)</div>
            <div className={styles.total}>{userInfo.asset}</div>
          </div>
          <div className={styles.line2} >
            <span className={styles.item}>
              <div className={styles.text}>持有收益</div>
              <div className={styles.info}>{userInfo.holdProfit}</div>
            </span>
            <span className={styles.item}>
              <div className={styles.text}>交易次数(近6月)</div>
              <div className={styles.info}>{userInfo.tradeIn6Months}</div>
            </span>
            <span className={styles.item}>
              <div className={styles.text}>风险类型</div>
              <div className={styles.info}>{userInfo.riskLevelName}</div>
            </span>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.title}>我的持仓</div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
        </div>
      </main>
    </div>
  );
}
