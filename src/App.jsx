import { useState, useRef, useEffect, useCallback } from "react";

const ZINGER_BURGER_IMG = "https://www.figma.com/api/mcp/asset/2ec58a61-5931-4113-ba86-6fde31b0df2b";
const ZINGER_MEAL_IMG = "https://www.figma.com/api/mcp/asset/7ddde888-cb65-4e29-bfb8-982fafb32df4";
const ZINGER_THUMB = "https://www.figma.com/api/mcp/asset/6c63f79f-7371-412f-8e83-69459935a3de";
const MEAL_THUMB = "https://www.figma.com/api/mcp/asset/20e844cb-1796-42e3-946a-7bf4b9ef5978";

const IMAGE_HEIGHT = 209;
const HEADER_HEIGHT = 56;
const COLLAPSE_THRESHOLD = IMAGE_HEIGHT - HEADER_HEIGHT;

function StatusBar({ onReset }) {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-black text-white">
      <span className="text-[15px] font-semibold tracking-tight cursor-default select-none" onClick={onReset}>19:41</span>
      <div className="flex items-center gap-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="white" />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="white" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white" opacity="0.35" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 3.6c1.7 0 3.2.7 4.3 1.8l1.4-1.4C12 2.3 10.1 1.4 8 1.4S4 2.3 2.3 4l1.4 1.4C4.8 4.3 6.3 3.6 8 3.6zM8 6.8c.9 0 1.7.4 2.3 1l1.4-1.4C10.6 5.3 9.4 4.8 8 4.8s-2.6.5-3.7 1.6l1.4 1.4c.6-.6 1.4-1 2.3-1zM9.2 9.2a1.7 1.7 0 10-2.4 0 1.7 1.7 0 002.4 0z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="18" height="8" rx="1" fill="white" />
          <rect x="23" y="4" width="2" height="4" rx="1" fill="white" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function SheetTop() {
  return (
    <div className="bg-black">
      <div className="relative h-[21px]">
        <div className="absolute inset-x-4 top-[11px] h-[10px] bg-[#d5d5d9] rounded-t-[9px]" />
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M14 4L4 14M4 4l10 10" stroke="#1ba69c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="#1ba69c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1ba69c" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function FloatingButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-white rounded-full border border-border-muted shadow-sm flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function StickyHeader({ title, leftIcon, onLeftClick, collapsed }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 transition-all duration-200"
      style={{
        opacity: collapsed ? 1 : 0,
        pointerEvents: collapsed ? "auto" : "none",
      }}
    >
      <div className="bg-bg-surface flex items-center h-[56px] px-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]">
        <button onClick={onLeftClick} className="w-10 h-10 flex items-center justify-center shrink-0">
          {leftIcon}
        </button>
        <span className="flex-1 text-[16px] font-bold text-text-primary text-center leading-6 truncate px-2">
          {title}
        </span>
        <button className="w-10 h-10 flex items-center justify-center shrink-0">
          <HeartIcon />
        </button>
      </div>
    </div>
  );
}

function FloatingAppBarFixed({ leftIcon, onLeftClick, collapsed }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[56px] flex items-center justify-between px-4 z-20 transition-opacity duration-200"
      style={{
        opacity: collapsed ? 0 : 1,
        pointerEvents: collapsed ? "none" : "auto",
      }}
    >
      <FloatingButton onClick={onLeftClick}>{leftIcon}</FloatingButton>
      <FloatingButton onClick={() => {}}><HeartIcon /></FloatingButton>
    </div>
  );
}

function useScrollCollapse(scrollRef) {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollY(scrollRef.current.scrollTop);
    }
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef, handleScroll]);

  const collapsed = scrollY >= COLLAPSE_THRESHOLD;
  return { scrollY, collapsed };
}

function Stepper({ value, onChange }) {
  return (
    <div className="flex items-center justify-center gap-10">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-6 h-6 flex items-center justify-center"
        disabled={value <= 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" stroke={value <= 1 ? "#bfcaca" : "#1ba69c"} strokeWidth="2" />
          <path d="M8 12h8" stroke={value <= 1 ? "#bfcaca" : "#1ba69c"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="text-[22px] font-bold text-text-primary leading-7 w-4 text-center">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" stroke="#1ba69c" strokeWidth="2" />
          <path d="M12 8v8M8 12h8" stroke="#1ba69c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={onChange} className="w-6 h-6 flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="0.5" y="0.5" width="19" height="19" rx="3.5"
          fill={checked ? "#00CCBC" : "transparent"}
          stroke={checked ? "#00CCBC" : "#d0d5d5"}
          style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
        />
        <path
          d="M5.5 10l3 3 6-6"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? "scale(1)" : "scale(0.5)",
            transformOrigin: "center",
            transition: "opacity 150ms ease, transform 150ms ease",
          }}
        />
      </svg>
    </button>
  );
}

function RadioButton({ selected, onChange }) {
  return (
    <button onClick={onChange} className="w-6 h-6 flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10" cy="10" r="9.5"
          stroke={selected ? "#00CCBC" : "#d0d5d5"}
          style={{ transition: "stroke 150ms ease" }}
        />
        <circle
          cx="10" cy="10"
          r={selected ? 5 : 0}
          fill="#00CCBC"
          style={{ transition: "r 150ms ease, opacity 150ms ease", opacity: selected ? 1 : 0 }}
        />
      </svg>
    </button>
  );
}

function Divider({ inset = false }) {
  return <div className={`h-[0.5px] bg-black/8 ${inset ? "ml-4" : ""}`} />;
}

function SectionHeader({ title }) {
  return (
    <div className="pt-4 pb-2 px-4">
      <h3 className="text-[18px] font-bold text-text-primary leading-6">{title}</h3>
    </div>
  );
}

function MobileRow({ title, trailing, onClick, hasChevron = false, bg = "bg-bg-surface" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 ${bg} text-left`}
    >
      <span className="flex-1 text-[16px] text-text-primary leading-6 pr-2">{title}</span>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {hasChevron && (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="#1ba69c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

function CheckboxRow({ title, price, checked, onChange }) {
  return (
    <>
      <MobileRow
        title={title}
        onClick={onChange}
        trailing={
          <div className="flex items-center gap-2">
            {price && <span className="text-[16px] text-text-primary">{price}</span>}
            <Checkbox checked={checked} onChange={onChange} />
          </div>
        }
      />
      <Divider inset />
    </>
  );
}

function BasketBar({ quantity, onQuantityChange, price, onAdd }) {
  return (
    <div className="bg-bg-surface shadow-[0px_-2px_8px_0px_rgba(0,0,0,0.12)] px-4 py-6 flex flex-col gap-6 items-center">
      <Stepper value={quantity} onChange={onQuantityChange} />
      <button
        onClick={onAdd}
        className="w-full h-12 bg-brand-button rounded flex items-center justify-center"
      >
        <span className="text-[16px] font-bold text-brand-dark leading-6">Add for {price}</span>
      </button>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="h-[21px] flex items-center justify-center bg-bg-surface">
      <div className="w-[135px] h-[5px] bg-black rounded-full" />
    </div>
  );
}

function SingleItemScreen({ onUpgrade }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUpgrade, setSelectedUpgrade] = useState("burger");
  const [extras, setExtras] = useState({});
  const scrollRef = useRef(null);
  const { collapsed } = useScrollCollapse(scrollRef);

  const basePrice = 7.49;
  const extraPrices = {
    "Hot Wings: 2 pc": 2.99,
    "Mini Fillet": 2.49,
    "Original Recipe Chicken: 1 pc": 2.79,
    "Kansas BBQ Drip'd Bites": 3.99,
    "Sweet Chilli Drip'd Bites": 3.99,
  };

  const extrasTotal = Object.entries(extras)
    .filter(([, v]) => v)
    .reduce((sum, [k]) => sum + (extraPrices[k] || 0), 0);
  const total = ((basePrice + extrasTotal) * quantity).toFixed(2);

  const toggleExtra = (name) => setExtras((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="h-full flex flex-col bg-bg-app rounded-t-[12px] overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <StickyHeader
          title="Zinger Burger"
          leftIcon={<CloseIcon />}
          onLeftClick={() => {}}
          collapsed={collapsed}
        />

        <FloatingAppBarFixed
          leftIcon={<CloseIcon />}
          onLeftClick={() => {}}
          collapsed={collapsed}
        />

        <div className="absolute top-0 left-0 right-0 h-[209px] bg-white overflow-hidden z-0">
          <img src={ZINGER_BURGER_IMG} alt="Zinger Burger" className="absolute left-0 top-[-63px] w-[375px] h-[301px] object-cover" />
        </div>

        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto z-10">
          <div className="relative">
            <div style={{ height: IMAGE_HEIGHT }} />

            <div className="bg-bg-app relative rounded-t-[12px]">
              <div className="px-4 pt-3 pb-2">
                <h1 className="text-[18px] font-bold text-text-primary leading-6">Zinger Burger</h1>
              </div>
              <div className="px-4 pb-2">
                <p className="text-[14px] text-text-primary leading-5">
                  Spicy Zinger Fillet Burger. Packs a zingy punch.
                </p>
              </div>
              <div className="px-4 pb-4 flex items-center gap-1">
                <span className="text-[14px] text-text-muted">450 kcal</span>
                <span className="text-[14px] text-text-muted">·</span>
                <span className="text-[14px] text-positive">★</span>
                <span className="text-[14px] text-positive-text">5.0</span>
                <span className="text-[14px] text-text-muted">(500+)</span>
              </div>

              <div className="mx-4 mb-2 border border-black/8 rounded bg-bg-surface px-4 py-3">
                <p className="text-[12px] text-text-secondary leading-4">
                  Questions about allergens, ingredients, or products?
                </p>
                <p className="text-[12px] text-action-teal leading-4">Contact the restaurant</p>
              </div>

              <SectionHeader title="Upgrade your meal?" />
              <div className="mx-4 mb-2 border border-border-subtle rounded overflow-hidden">
                <div className="flex items-center px-4 py-3 bg-bg-surface">
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-2 shrink-0">
                    <img src={ZINGER_THUMB} alt="Zinger Burger" className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1 text-[16px] text-text-primary leading-6">Zinger Burger</span>
                  <Checkbox checked={selectedUpgrade === "burger"} onChange={() => setSelectedUpgrade("burger")} />
                </div>
                <Divider />
                <button
                  onClick={() => onUpgrade()}
                  className="w-full flex items-center px-4 py-3 bg-bg-surface text-left"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-2 shrink-0">
                    <img src={MEAL_THUMB} alt="Zinger Burger Meal" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] text-text-primary leading-6">Zinger Burger Meal</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] text-text-muted">+ £4.50</span>
                      <span className="text-[14px] text-text-muted">·</span>
                      <span className="text-[14px] text-action-teal">Get more for less</span>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="#1ba69c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <SectionHeader title="Extra chicken?" />
              {Object.entries(extraPrices).map(([name, price]) => (
                <CheckboxRow
                  key={name}
                  title={name}
                  price={`+£${price.toFixed(2)}`}
                  checked={!!extras[name]}
                  onChange={() => toggleExtra(name)}
                />
              ))}
              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 relative z-20">
        <BasketBar quantity={quantity} onQuantityChange={setQuantity} price={`£${total}`} onAdd={() => {}} />
        <HomeIndicator />
      </div>
    </div>
  );
}

function ItemUpsellScreen({ onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPreviousOrder, setSelectedPreviousOrder] = useState(null);
  const [selectedFries, setSelectedFries] = useState(null);
  const [expandedDrink, setExpandedDrink] = useState(null);
  const [selectedDrinkSize, setSelectedDrinkSize] = useState({});
  const [extras, setExtras] = useState({});
  const scrollRef = useRef(null);
  const { collapsed } = useScrollCollapse(scrollRef);

  const basePrice = 9.98;
  const friesPrices = {
    "Regular Signature Fries": 0,
    "Large Signature Fries": 0.49,
    "Dirty Loaded Fries": 2.99,
  };
  const drinkSizePrices = { Large: 2.0, Medium: 1.5, Small: 0 };
  const extraPrices = {
    "Hot Wings: 2 pc": 2.99,
    "Mini Fillet": 2.49,
    "Original Recipe Chicken: 1 pc": 2.79,
    "Kansas BBQ Drip'd Bites": 3.99,
    "Sweet Chilli Drip'd Bites": 3.99,
  };

  const friesUpcharge = friesPrices[selectedFries] || 0;
  const drinkUpcharge = Object.values(selectedDrinkSize).reduce(
    (sum, size) => sum + (drinkSizePrices[size] || 0),
    0
  );
  const extrasTotal = Object.entries(extras)
    .filter(([, v]) => v)
    .reduce((sum, [k]) => sum + (extraPrices[k] || 0), 0);
  const total = ((basePrice + friesUpcharge + drinkUpcharge + extrasTotal) * quantity).toFixed(2);

  const toggleExtra = (name) => setExtras((prev) => ({ ...prev, [name]: !prev[name] }));

  const drinks = ["Pepsi", "Dr. Pepper", "Sprite", "Fanta"];
  const drinkSizes = ["Large", "Medium", "Small"];

  const previousOrders = [
    { id: 1, title: "Dirty Loaded Fries, Large Sp...", subtitle: "Ordered: Jan 16, 2026" },
    { id: 2, title: "Large fries, Small Pepsi", subtitle: "Ordered 16 Jun, 2025" },
  ];

  return (
    <div className="h-full flex flex-col bg-bg-app rounded-t-[12px] overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <StickyHeader
          title="Zinger Burger Meal"
          leftIcon={<BackIcon />}
          onLeftClick={onBack}
          collapsed={collapsed}
        />

        <FloatingAppBarFixed
          leftIcon={<BackIcon />}
          onLeftClick={onBack}
          collapsed={collapsed}
        />

        <div className="absolute top-0 left-0 right-0 h-[209px] overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#eaeaec]" />
          <img src={ZINGER_MEAL_IMG} alt="Zinger Burger Meal" className="absolute inset-x-[10%] top-0 h-full object-contain" />
        </div>

        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto z-10">
          <div className="relative">
            <div style={{ height: IMAGE_HEIGHT }} />

            <div className="bg-bg-app relative rounded-t-[12px]">
              <div className="px-4 pt-3 pb-2">
                <h1 className="text-[18px] font-bold text-text-primary leading-6">Zinger Burger Meal</h1>
              </div>
              <div className="px-4 pb-2">
                <p className="text-[14px] text-text-primary leading-5">
                  The classic Zinger Burger, plus fries & a drink. The meal with a kick. The calorie information for this meal does not include the selectable items below.
                </p>
              </div>
              <div className="px-4 pb-4 flex items-center gap-1">
                <span className="text-[14px] text-text-muted">450 kcal</span>
                <span className="text-[14px] text-text-muted">·</span>
                <span className="text-[14px] text-positive">★</span>
                <span className="text-[14px] text-positive-text">5.0</span>
                <span className="text-[14px] text-text-muted">(500+)</span>
              </div>

              <div className="mx-4 mb-2 border border-black/8 rounded bg-bg-surface px-4 py-3">
                <p className="text-[12px] text-text-secondary leading-4">
                  Questions about allergens, ingredients, or products?
                </p>
                <p className="text-[12px] text-action-teal leading-4">Contact the restaurant</p>
              </div>

              <SectionHeader title="Select again" />
              <div className="pb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x" style={{ scrollPaddingLeft: 16 }}>
                  <div className="shrink-0" style={{ minWidth: 14 }} />
                  {previousOrders.map((order) => {
                    const isSelected = selectedPreviousOrder === order.id;
                    const toggle = () => setSelectedPreviousOrder(isSelected ? null : order.id);
                    return (
                      <button
                        key={order.id}
                        onClick={toggle}
                        className={`shrink-0 w-[280px] p-4 rounded border bg-bg-surface text-left snap-start transition-colors duration-150 ${
                          isSelected ? "border-brand" : "border-border-subtle"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-bold text-text-primary leading-6 truncate">{order.title}</p>
                            <p className="text-[14px] text-text-muted leading-5">{order.subtitle}</p>
                          </div>
                          <RadioButton
                            selected={isSelected}
                            onChange={toggle}
                          />
                        </div>
                      </button>
                    );
                  })}
                  <div className="shrink-0" style={{ minWidth: 14 }} />
                </div>
              </div>

              <SectionHeader title="Choose your fries" />
              {Object.entries(friesPrices).map(([name, price]) => (
                <div key={name}>
                  <MobileRow
                    title={name}
                    onClick={() => setSelectedFries(name)}
                    trailing={
                      <div className="flex items-center gap-2">
                        {price > 0 && <span className="text-[16px] text-text-primary">+£{price.toFixed(2)}</span>}
                        <Checkbox checked={selectedFries === name} onChange={() => setSelectedFries(name)} />
                      </div>
                    }
                  />
                  <Divider inset />
                </div>
              ))}

              <SectionHeader title="Frequently added drinks" />
              {drinks.map((drink) => (
                <div key={drink}>
                  <MobileRow
                    title={drink}
                    onClick={() => setExpandedDrink(expandedDrink === drink ? null : drink)}
                    hasChevron
                    trailing={null}
                  />
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-200 ease-in-out"
                    style={{
                      gridTemplateRows: expandedDrink === drink ? "1fr" : "0fr",
                      opacity: expandedDrink === drink ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="bg-bg-surface px-4 pt-2 pb-4">
                        <div className="rounded-lg overflow-hidden bg-bg-app">
                          {drinkSizes.map((size, i) => {
                            const isSelected = selectedDrinkSize[drink] === size;
                            const sPrice = drinkSizePrices[size];
                            return (
                              <div key={size}>
                                <MobileRow
                                  title={size}
                                  bg="bg-transparent"
                                  onClick={() =>
                                    setSelectedDrinkSize((prev) => ({ ...prev, [drink]: size }))
                                  }
                                  trailing={
                                    <div className="flex items-center gap-2">
                                      {sPrice > 0 && (
                                        <span className="text-[16px] text-text-primary">+£{sPrice.toFixed(2)}</span>
                                      )}
                                      <RadioButton
                                        selected={isSelected}
                                        onChange={() =>
                                          setSelectedDrinkSize((prev) => ({ ...prev, [drink]: size }))
                                        }
                                      />
                                    </div>
                                  }
                                />
                                {i < drinkSizes.length - 1 && <Divider inset />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider inset />
                </div>
              ))}

              <SectionHeader title="Extra chicken?" />
              {Object.entries(extraPrices).map(([name, price]) => (
                <CheckboxRow
                  key={name}
                  title={name}
                  price={`+£${price.toFixed(2)}`}
                  checked={!!extras[name]}
                  onChange={() => toggleExtra(name)}
                />
              ))}
              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 relative z-20">
        <BasketBar quantity={quantity} onQuantityChange={setQuantity} price={`£${total}`} onAdd={() => {}} />
        <HomeIndicator />
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("single");
  const [direction, setDirection] = useState("forward");
  const [transitioning, setTransitioning] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setScreen("single");
    setDirection("forward");
    setTransitioning(false);
  };

  const goToUpsell = () => {
    setDirection("forward");
    setTransitioning(true);
    setTimeout(() => {
      setScreen("upsell");
      setTransitioning(false);
    }, 300);
  };

  const goToSingle = () => {
    setDirection("back");
    setTransitioning(true);
    setTimeout(() => {
      setScreen("single");
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <StatusBar onReset={handleReset} />
      <SheetTop />

      <div className="relative flex-1" style={{ height: "calc(100% - 65px)" }} key={resetKey}>
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{
            transform:
              screen === "single" && !transitioning
                ? "translateX(0)"
                : screen === "single" && transitioning && direction === "forward"
                  ? "translateX(-100%)"
                  : screen === "upsell" && !transitioning
                    ? "translateX(-100%)"
                    : "translateX(0)",
          }}
        >
          <div className="absolute inset-0" style={{ width: "200%", display: "flex" }}>
            <div className="w-1/2 h-full">
              <SingleItemScreen onUpgrade={goToUpsell} />
            </div>
            <div className="w-1/2 h-full">
              <ItemUpsellScreen onBack={goToSingle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
