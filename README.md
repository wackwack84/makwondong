# usage-meter

Claude 프롬프트 아래 상태줄에 요금제 사용량(5시간 / 주간)과 컨텍스트 사용률을 실시간으로 보여주는 모드입니다.

```
사용량 · 5시간 23.5% (2시간 10분 후 리셋) · 주간 41% (3일 후 리셋) · 컨텍스트 12%
```

## 설치

터미널 세션의 프롬프트에서:

```
/plugin install usage-meter --marketplace wackwack84/makwondong
```

`Add marketplace?`에 `y`, 그다음 범위(user)를 Enter로 선택합니다.

셸에서:

```
claude plugin install usage-meter --marketplace wackwack84/makwondong
```

데스크톱 앱에서(`/plugin`이 동작하지 않는 곳): 프롬프트 옆 **+** → **Plugins** → **Add marketplace**에 `wackwack84/makwondong` 입력 → **Add plugin**.

