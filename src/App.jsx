import { useMemo, useState } from "react";
import { addDays } from "date-fns/addDays";
import { format } from "date-fns/format";
import { isSameDay } from "date-fns/isSameDay";
import { startOfWeek } from "date-fns/startOfWeek";
// TODO : 切り分けたCSSファイルをインポート
import "./App.css";

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

function App() {
  const [startOfDate, setStartOfDate] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState([]);

  // TODO : 予定の追加・編集のための入力欄を表示するためのステートを追加
  const [activeDateKey, setActiveDateKey] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingStartTime, setEditingStartTime] = useState("");
  const [editingEndTime, setEditingEndTime] = useState("");

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfDate, i));
  }, [startOfDate]);

  const addSampleEvent = (date) => {
    // ! 修正 : newTitle を保存するように変更
    // ? setEvents((prev) => {
    // ?   const sameDayCount = prev.filter((event) =>
    // ?     isSameDay(event.date, date),
    // ?   ).length;
    // ?   return [
    // ?     ...prev,
    // ?     {
    // ?       id: prev.length + 1,
    // ?       title: `予定 ${sameDayCount + 1}`,
    // ?       date: new Date(date),
    // ?     },
    // ?   ];
    // ? });
    // ? });

    // ? const removeEvent = (id) => {
    // ?   setEvents((prev) => prev.filter((event) => event.id !== id));
    // ? };

    // TODO : 予定の追加・編集のための関数を実装
    if (!newTitle || newTitle.trim() === "") return;

    setEvents((prev) => {
      return [
        ...prev,
        {
          // ! IDが被らないようにタイムスタンプを使用
          id: Date.now(),
          title: newTitle,
          startTime: newStartTime,
          endTime: newEndTime,
          date: new Date(date),
        },
      ];
    });

    setActiveDateKey(null);
    setNewTitle("");
    setNewStartTime("");
    setNewEndTime("");
  };

  // TODO : 予定の編集を保存するための関数を実装
  const updateEvent = (id) => {
    if (!editingTitle || editingTitle.trim() === "") return;

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              title: editingTitle,
              startTime: editingStartTime,
              endTime: editingEndTime,
            }
          : event,
      ),
    );
    setEditingId(null);
    setEditingTitle("");
    setEditingStartTime("");
    setEditingEndTime("");
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    // ! 修正 : classNameを使ってCSSを適用
    <main className="calendar-container">
      <header className="calendar-header">
        <h1 className="calendar-title">週カレンダー</h1>
        <div className="nav-buttons">
          <button
            onClick={() => setStartOfDate((prev) => addDays(prev, -7))}
            className="nav-btn"
          >
            前の週
          </button>
          <button
            onClick={() => setStartOfDate((prev) => addDays(prev, 7))}
            className="nav-btn"
          >
            次の週
          </button>
        </div>
      </header>

      <div className="week-grid">
        {weekDates.map((date) => {
          const dayEvents = events
            .filter((event) => isSameDay(event.date, date))
            .sort((a, b) =>
              (a.startTime || "").localeCompare(b.startTime || ""),
            );

          const dateKey = date.toISOString();
          const dayNum = date.getDay();
          const isToday = isSameDay(date, new Date());

          // ! 修正 : 土曜・日曜・今日をクラス名として判定し動的に渡す
          const dayClass =
            dayNum === 0 ? "sunday" : dayNum === 6 ? "saturday" : "";

          return (
            <section
              key={dateKey}
              className={`day-card ${dayClass} ${isToday ? "today" : ""}`}
            >
              {/* ? <h2>{format(date, "MM/dd (EEE)")}</h2> */}
              <h2 className={`day-header ${dayClass}`}>
                <span>{format(date, "M/d")}</span>
                <span>{weekLabels[dayNum]}曜日</span>
              </h2>

              {/* ! 修正 : 西暦のpタグを削除 */}
              {/* ? <p>
                ?   {format(date, "yyyy/MM/dd")} ({weekLabels[date.getDay()]})
                ? </p> */}

              {/* ! 修正 : 元の追加ボタンを非表示に */}
              {/* ? <button onClick={() => addSampleEvent(date)}>
                ?   この日に予定を追加
                ? </button> */}

              {/* TODO : 各カードのメイン描写エリア（ここに方眼背景が付きます） */}
              <div className="day-body">
                {/* TODO : ボタンを押したら入力欄と保存ボタンが出る切り替えを実装 */}
                {activeDateKey !== dateKey ? (
                  <button
                    onClick={() => {
                      setActiveDateKey(dateKey);
                      setNewTitle("");
                      setNewStartTime("");
                      setNewEndTime("");
                    }}
                    className="add-init-btn"
                  >
                    + 予定を追加
                  </button>
                ) : (
                  <div className="input-form-container">
                    <input
                      type="text"
                      placeholder="予定を入力"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="event-input"
                    />
                    {/* 時間入力欄の追加 */}
                    <div className="time-input-group">
                      <input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="event-input-time"
                      />
                      <span>〜</span>
                      <input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="event-input-time"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        onClick={() => addSampleEvent(date)}
                        className="btn-save"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setActiveDateKey(null)}
                        className="btn-cancel"
                      >
                        消す
                      </button>
                    </div>
                  </div>
                )}

                <ul className="event-list">
                  {dayEvents.map((event) => (
                    <li key={event.id} className="event-item">
                      {/* ! 修正 : 元のタイトルと削除ボタンの通常表示を変更 */}
                      {/* ? {event.title}
                      ? <button onClick={() => removeEvent(event.id)}>削除</button> */}

                      {/* TODO : 通常表示と編集モードの切り替え、編集・削除ボタンの配置を実装 */}
                      {editingId === event.id ? (
                        <div className="edit-form-container">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="event-input"
                          />
                          {/* 編集用の時間入力欄 */}
                          <div className="time-input-group">
                            <input
                              type="time"
                              value={editingStartTime}
                              onChange={(e) =>
                                setEditingStartTime(e.target.value)
                              }
                              className="event-input-time"
                            />
                            <span>〜</span>
                            <input
                              type="time"
                              value={editingEndTime}
                              onChange={(e) =>
                                setEditingEndTime(e.target.value)
                              }
                              className="event-input-time"
                            />
                          </div>
                          <div className="form-actions">
                            <button
                              onClick={() => updateEvent(event.id)}
                              className="btn-update"
                            >
                              更新
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn-cancel"
                            >
                              消す
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="event-view-mode">
                          <div className="event-content">
                            {/* 登録された時間の表示（時間が設定されている場合のみ） */}
                            {(event.startTime || event.endTime) && (
                              <div className="event-time-text">
                                {event.startTime || "--:--"} 〜{" "}
                                {event.endTime || "--:--"}
                              </div>
                            )}
                            <span className="event-title-text">
                              {event.title}
                            </span>
                          </div>
                          <div className="event-actions">
                            <button
                              onClick={() => {
                                setEditingId(event.id);
                                setEditingTitle(event.title);
                                setEditingStartTime(event.startTime || "");
                                setEditingEndTime(event.endTime || "");
                              }}
                              className="btn-edit"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => removeEvent(event.id)}
                              className="btn-delete"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default App;
