/**
 * formのonSubmitイベントから
 * input等のID指定で要素を取り出すための型
 * `event.target.input_id.value` のように記述すれば入力値を取り出せる
 * targetの下をいちいち定義するのが面倒なので手抜き用
 */
export type AnyFormEvent = React.FormEvent<HTMLFormElement> & { target: any } & { nativeEvent: { submitter: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> } };