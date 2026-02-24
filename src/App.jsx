import { useState, useRef, useEffect, useCallback } from "react";

const ZINGER_BURGER_IMG = "https://www.figma.com/api/mcp/asset/2ec58a61-5931-4113-ba86-6fde31b0df2b";
const ZINGER_MEAL_IMG = "https://www.figma.com/api/mcp/asset/7ddde888-cb65-4e29-bfb8-982fafb32df4";
const ZINGER_THUMB = "https://www.figma.com/api/mcp/asset/6c63f79f-7371-412f-8e83-69459935a3de";
const MEAL_THUMB = "https://www.figma.com/api/mcp/asset/20e844cb-1796-42e3-946a-7bf4b9ef5978";
const NUGGETS_IMG = "https://www.figma.com/api/mcp/asset/2ec58a61-5931-4113-ba86-6fde31b0df2b";

const IMAGE_HEIGHT = 209;
const HEADER_HEIGHT = 56;
const COLLAPSE_THRESHOLD = IMAGE_HEIGHT - HEADER_HEIGHT;

const EXTRA_PRICES = {
  "Hot Wings: 2 pc": 2.99,
  "Mini Fillet": 2.49,
  "Original Recipe Chicken: 1 pc": 2.79,
  "Kansas BBQ Drip'd Bites": 3.99,
  "Sweet Chilli Drip'd Bites": 3.99,
};

const FRIES_PRICES = {
  "Regular Signature Fries": 0,
  "Large Signature Fries": 0.49,
  "Dirty Loaded Fries": 2.99,
};

const DRINK_SIZE_PRICES = { Large: 2.0, Medium: 1.5, Small: 0 };

function StatusBar({ onReset, light }) {
  const bg = light ? "bg-white" : "bg-black";
  const fg = light ? "text-black" : "text-white";
  const iconColor = light ? "black" : "white";
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 transition-colors duration-300 ${bg} ${fg}`}>
      <span className="text-[15px] font-semibold tracking-tight cursor-default select-none" onClick={onReset}>19:41</span>
      <div className="flex items-center gap-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill={iconColor} />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill={iconColor} />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill={iconColor} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={iconColor} opacity="0.35" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={iconColor}>
          <path d="M8 3.6c1.7 0 3.2.7 4.3 1.8l1.4-1.4C12 2.3 10.1 1.4 8 1.4S4 2.3 2.3 4l1.4 1.4C4.8 4.3 6.3 3.6 8 3.6zM8 6.8c.9 0 1.7.4 2.3 1l1.4-1.4C10.6 5.3 9.4 4.8 8 4.8s-2.6.5-3.7 1.6l1.4 1.4c.6-.6 1.4-1 2.3-1zM9.2 9.2a1.7 1.7 0 10-2.4 0 1.7 1.7 0 002.4 0z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke={iconColor} strokeOpacity="0.35" />
          <rect x="2" y="2" width="18" height="8" rx="1" fill={iconColor} />
          <rect x="23" y="4" width="2" height="4" rx="1" fill={iconColor} opacity="0.4" />
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
  const Tag = onChange ? "button" : "div";
  return (
    <Tag onClick={onChange} className="w-6 h-6 flex items-center justify-center shrink-0">
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
    </Tag>
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

function SectionHeader({ title, trailing }) {
  return (
    <div className="pt-4 pb-2 px-4 flex items-center justify-between">
      <h3 className="text-[18px] font-bold text-text-primary leading-6">{title}</h3>
      {trailing}
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
            <Checkbox checked={checked} />
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

function SingleItemScreen({ onUpgrade, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUpgrade, setSelectedUpgrade] = useState("burger");
  const [extras, setExtras] = useState({});
  const scrollRef = useRef(null);
  const { collapsed } = useScrollCollapse(scrollRef);

  const basePrice = 7.49;

  const extrasTotal = Object.entries(extras)
    .filter(([, v]) => v)
    .reduce((sum, [k]) => sum + (EXTRA_PRICES[k] || 0), 0);
  const total = ((basePrice + extrasTotal) * quantity).toFixed(2);

  const toggleExtra = (name) => setExtras((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleAdd = () => {
    const selectedExtras = Object.entries(extras).filter(([, v]) => v).map(([k]) => k);
    onAdd({
      type: "burger",
      name: "Zinger Burger",
      basePrice,
      quantity,
      extras: selectedExtras,
      total: parseFloat(total),
    });
  };

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
                <p className="text-[14px] text-text-primary leading-5">Spicy Zinger Fillet Burger. Packs a zingy punch.</p>
              </div>
              <div className="px-4 pb-4 flex items-center gap-1">
                <span className="text-[14px] text-text-muted">450 kcal</span>
                <span className="text-[14px] text-text-muted">·</span>
                <span className="text-[14px] text-positive">★</span>
                <span className="text-[14px] text-positive-text">5.0</span>
                <span className="text-[14px] text-text-muted">(500+)</span>
              </div>
              <div className="mx-4 mb-2 border border-black/8 rounded bg-bg-surface px-4 py-3">
                <p className="text-[12px] text-text-secondary leading-4">Questions about allergens, ingredients, or products?</p>
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
                <button onClick={() => onUpgrade()} className="w-full flex items-center px-4 py-3 bg-bg-surface text-left">
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
              {Object.entries(EXTRA_PRICES).map(([name, price]) => (
                <CheckboxRow key={name} title={name} price={`+£${price.toFixed(2)}`} checked={!!extras[name]} onChange={() => toggleExtra(name)} />
              ))}
              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 relative z-20">
        <BasketBar quantity={quantity} onQuantityChange={setQuantity} price={`£${total}`} onAdd={handleAdd} />
        <HomeIndicator />
      </div>
    </div>
  );
}

function ItemUpsellScreen({ onBack, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPreviousOrder, setSelectedPreviousOrder] = useState(null);
  const [selectedFries, setSelectedFries] = useState(null);
  const [expandedDrink, setExpandedDrink] = useState(null);
  const [selectedDrinkSize, setSelectedDrinkSize] = useState({});
  const [extras, setExtras] = useState({});
  const scrollRef = useRef(null);
  const { collapsed } = useScrollCollapse(scrollRef);

  const basePrice = 9.98;

  const friesUpcharge = FRIES_PRICES[selectedFries] || 0;
  const drinkUpcharge = Object.values(selectedDrinkSize).reduce(
    (sum, size) => sum + (DRINK_SIZE_PRICES[size] || 0), 0
  );
  const extrasTotal = Object.entries(extras)
    .filter(([, v]) => v)
    .reduce((sum, [k]) => sum + (EXTRA_PRICES[k] || 0), 0);
  const total = ((basePrice + friesUpcharge + drinkUpcharge + extrasTotal) * quantity).toFixed(2);

  const toggleExtra = (name) => setExtras((prev) => ({ ...prev, [name]: !prev[name] }));

  const drinks = ["Pepsi", "Dr. Pepper", "Sprite", "Fanta"];
  const drinkSizes = ["Large", "Medium", "Small"];

  const previousOrders = [
    { id: 1, title: "Dirty Loaded Fries, Large Sp...", subtitle: "Ordered: Jan 16, 2026" },
    { id: 2, title: "Large fries, Small Pepsi", subtitle: "Ordered 16 Jun, 2025" },
  ];

  const selectedDrink = Object.entries(selectedDrinkSize).find(([, v]) => v);

  const handleAdd = () => {
    const selectedExtras = Object.entries(extras).filter(([, v]) => v).map(([k]) => k);
    const drinkEntry = Object.entries(selectedDrinkSize)[0];
    onAdd({
      type: "meal",
      name: "Zinger Burger Meal",
      basePrice,
      quantity,
      fries: selectedFries,
      friesPrice: FRIES_PRICES[selectedFries] || 0,
      drink: drinkEntry ? { name: drinkEntry[0], size: drinkEntry[1], price: DRINK_SIZE_PRICES[drinkEntry[1]] || 0 } : null,
      extras: selectedExtras,
      total: parseFloat(total),
    });
  };

  return (
    <div className="h-full flex flex-col bg-bg-app rounded-t-[12px] overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <StickyHeader title="Zinger Burger Meal" leftIcon={<BackIcon />} onLeftClick={onBack} collapsed={collapsed} />
        <FloatingAppBarFixed leftIcon={<BackIcon />} onLeftClick={onBack} collapsed={collapsed} />
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
                <p className="text-[14px] text-text-primary leading-5">The classic Zinger Burger, plus fries & a drink. The meal with a kick. The calorie information for this meal does not include the selectable items below.</p>
              </div>
              <div className="px-4 pb-4 flex items-center gap-1">
                <span className="text-[14px] text-text-muted">450 kcal</span>
                <span className="text-[14px] text-text-muted">·</span>
                <span className="text-[14px] text-positive">★</span>
                <span className="text-[14px] text-positive-text">5.0</span>
                <span className="text-[14px] text-text-muted">(500+)</span>
              </div>
              <div className="mx-4 mb-2 border border-black/8 rounded bg-bg-surface px-4 py-3">
                <p className="text-[12px] text-text-secondary leading-4">Questions about allergens, ingredients, or products?</p>
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
                      <button key={order.id} onClick={toggle} className={`shrink-0 w-[280px] p-4 rounded border bg-bg-surface text-left snap-start transition-colors duration-150 ${isSelected ? "border-brand" : "border-border-subtle"}`}>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-bold text-text-primary leading-6 truncate">{order.title}</p>
                            <p className="text-[14px] text-text-muted leading-5">{order.subtitle}</p>
                          </div>
                          <RadioButton selected={isSelected} onChange={toggle} />
                        </div>
                      </button>
                    );
                  })}
                  <div className="shrink-0" style={{ minWidth: 14 }} />
                </div>
              </div>
              <SectionHeader title="Choose your fries" trailing={<span className="text-[14px] text-text-muted">Required</span>} />
              {Object.entries(FRIES_PRICES).map(([name, price]) => (
                <div key={name}>
                  <MobileRow title={name} onClick={() => setSelectedFries(name)} trailing={
                    <div className="flex items-center gap-2">
                      {price > 0 && <span className="text-[16px] text-text-primary">+£{price.toFixed(2)}</span>}
                      <Checkbox checked={selectedFries === name} onChange={() => setSelectedFries(name)} />
                    </div>
                  } />
                  <Divider inset />
                </div>
              ))}
              <SectionHeader title="Choose your drink" trailing={<span className="text-[14px] text-text-muted">Required</span>} />
              {drinks.map((drink) => (
                <div key={drink}>
                  <MobileRow title={drink} onClick={() => setExpandedDrink(expandedDrink === drink ? null : drink)} hasChevron trailing={null} />
                  <div className="grid transition-[grid-template-rows,opacity] duration-200 ease-in-out" style={{ gridTemplateRows: expandedDrink === drink ? "1fr" : "0fr", opacity: expandedDrink === drink ? 1 : 0 }}>
                    <div className="overflow-hidden">
                      <div className="bg-bg-surface px-4 pt-2 pb-4">
                        <div className="rounded-lg overflow-hidden bg-bg-app">
                          {drinkSizes.map((size, i) => {
                            const isSelected = selectedDrinkSize[drink] === size;
                            const sPrice = DRINK_SIZE_PRICES[size];
                            return (
                              <div key={size}>
                                <MobileRow title={size} bg="bg-transparent" onClick={() => setSelectedDrinkSize((prev) => ({ ...prev, [drink]: size }))} trailing={
                                  <div className="flex items-center gap-2">
                                    {sPrice > 0 && <span className="text-[16px] text-text-primary">+£{sPrice.toFixed(2)}</span>}
                                    <RadioButton selected={isSelected} onChange={() => setSelectedDrinkSize((prev) => ({ ...prev, [drink]: size }))} />
                                  </div>
                                } />
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
              {Object.entries(EXTRA_PRICES).map(([name, price]) => (
                <CheckboxRow key={name} title={name} price={`+£${price.toFixed(2)}`} checked={!!extras[name]} onChange={() => toggleExtra(name)} />
              ))}
              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 relative z-20">
        <BasketBar quantity={quantity} onQuantityChange={setQuantity} price={`£${total}`} onAdd={handleAdd} />
        <HomeIndicator />
      </div>
    </div>
  );
}

function ToggleSwitch({ on, onToggle }) {
  return (
    <button onClick={onToggle} className="w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-200" style={{ backgroundColor: on ? "#00CCBC" : "#E8EBEB" }}>
      <div className="w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform duration-200" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="#1ba69c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckoutScreen({ order, onBack }) {
  const [cutlery, setCutlery] = useState(false);
  const [roundUp, setRoundUp] = useState(false);
  const scrollRef = useRef(null);

  let mainItem = null;
  const extraItems = [];

  if (order) {
    if (order.type === "meal") {
      const parts = [];
      if (order.fries) parts.push(order.fries);
      if (order.drink) parts.push(`${order.drink.size} ${order.drink.name}`);
      const subtitle = parts.length > 0 ? parts.join(", ") : null;
      const itemPrice = order.basePrice + (order.friesPrice || 0) + (order.drink?.price || 0);
      mainItem = { qty: order.quantity, name: order.name, subtitle, price: itemPrice * order.quantity };
    } else {
      mainItem = { qty: order.quantity, name: order.name, subtitle: null, price: order.basePrice * order.quantity };
    }
    order.extras.forEach((extra) => {
      extraItems.push({ qty: order.quantity, name: extra, price: (EXTRA_PRICES[extra] || 0) * order.quantity });
    });
  }

  const itemsSubtotal = (mainItem?.price || 0) + extraItems.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = 0.99;
  const roundUpAmount = roundUp ? 0.52 : 0;
  const orderTotal = itemsSubtotal + serviceFee + roundUpAmount;
  const savings = (0.16 + 0.79).toFixed(2);

  const suggestedItems = [
    { name: "Popcorn Chicken", cal: "307 kcal", price: "£5.99", img: "https://brand-uk.assets.kfc.co.uk/2022-11/MOBORDER_REGULAR_POPCORN_CHICKEN_1200x800%20%281%29.jpg" },
    { name: "Regular Gravy", cal: "105 kcal", price: "£1.99", img: "https://brand-uk.assets.kfc.co.uk/2022-11/MOBORDER_REGULAR_GRAVY_1200x800.jpg" },
    { name: "Corn Cob", cal: "163 kcal", price: "£1.99", img: "https://brand-uk.assets.kfc.co.uk/2022-11/MOBORDER_CORN_COB_1200x800.jpg" },
    { name: "Regular Coleslaw", cal: "126 kcal", price: "£1.99", img: "https://brand-uk.assets.kfc.co.uk/2022-11/MOBORDER_REGULAR_COLESLAW_1200x800.jpg" },
    { name: "Regular Beans", cal: "167 kcal", price: "£1.99", img: "https://brand-uk.assets.kfc.co.uk/2022-11/MOBORDER_REGULAR_BEANS_1200x800.jpg" },
  ];

  return (
    <div className="h-full flex flex-col bg-bg-app">
      <div className="bg-bg-surface flex items-center h-[56px] px-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center shrink-0">
          <BackIcon />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[16px] font-bold text-text-primary leading-6">Your order</p>
          <p className="text-[12px] text-text-muted leading-4">KFC</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00CCBC" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <SectionHeader title="Basket" />
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1">
            <p className="text-[12px] text-text-muted leading-4 whitespace-nowrap">If anyone eating has an allergy, contact the restaurant</p>
            <ChevronRight />
          </div>
        </div>

        <div className="mx-4 border border-border-subtle rounded-lg overflow-hidden bg-bg-surface">
          {mainItem && (
            <div className="flex items-start px-4 py-3">
              <span className="text-[14px] text-text-primary w-8 shrink-0">{mainItem.qty}x</span>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-bold text-text-primary leading-6">{mainItem.name}</p>
                {mainItem.subtitle && <p className="text-[14px] text-text-muted leading-5">{mainItem.subtitle}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className="text-[16px] text-text-primary">£{mainItem.price.toFixed(2)}</span>
                <ChevronRight />
              </div>
            </div>
          )}
          {extraItems.map((item, i) => (
            <div key={i}>
              <Divider />
              <div className="flex items-start px-4 py-3">
                <span className="text-[14px] text-text-primary w-8 shrink-0">{item.qty}x</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] text-text-primary leading-6">{item.name}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[16px] text-text-primary">£{item.price.toFixed(2)}</span>
                  <ChevronRight />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 pb-2 px-4">
          <p className="text-[14px] font-bold text-text-primary leading-5">People also added</p>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {suggestedItems.map((item, i) => (
            <div key={i} className="shrink-0 w-[200px] border border-border-subtle rounded-lg overflow-hidden bg-bg-surface flex items-center p-2 gap-3">
              <div className="w-[60px] h-[60px] rounded-md bg-[#f5f5f5] overflow-hidden shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-[14px] font-bold text-text-primary leading-5 truncate">{item.name}</p>
                <p className="text-[12px] text-text-muted leading-4">{item.cal}</p>
                <p className="text-[14px] text-text-primary leading-5">{item.price}</p>
              </div>
              <div className="w-7 h-7 rounded-full border border-border-subtle flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v8M3 7h8" stroke="#1ba69c" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <SectionHeader title="Savings and offers" />
        <div className="mx-4 border border-border-subtle rounded-lg bg-bg-surface">
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">View offers</span>
            <ChevronRight />
          </div>
        </div>

        <SectionHeader title="Credit" />
        <div className="mx-4 border border-border-subtle rounded-lg bg-bg-surface px-4 py-3">
          <p className="text-[14px] text-action-teal leading-5">View credit</p>
        </div>

        <SectionHeader title="Summary" trailing={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10.5" stroke="#00CCBC" />
            <text x="11" y="15.5" textAnchor="middle" fill="#00CCBC" fontSize="13" fontWeight="bold">?</text>
          </svg>
        } />
        <div className="mx-4 border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">Basket subtotal</span>
            <span className="text-[16px] text-text-primary">£{itemsSubtotal.toFixed(2)}</span>
          </div>
          <Divider inset />
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">Service fee</span>
            <span className="text-[14px] text-text-muted line-through mr-2">£1.15</span>
            <span className="text-[16px] text-text-primary">£{serviceFee.toFixed(2)}</span>
          </div>
          <Divider inset />
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">Delivery fee</span>
            <span className="text-[14px] text-text-muted line-through mr-2">£0.79</span>
            <span className="text-[16px] text-brand font-bold">Free</span>
          </div>
        </div>
        <div className="mx-4 mt-2 rounded-lg overflow-hidden">
          <div className="bg-[#7B2D8E] px-4 py-3">
            <p className="text-[14px] font-bold text-white leading-5">You're saving £{savings} on fees!</p>
          </div>
          <div className="bg-[#F3E8F7] px-4 py-2.5">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px]">🚲</span>
                <span className="text-[14px] text-text-primary leading-5">£0.16 service fee saving</span>
              </div>
              <div className="w-[42px] h-[18px] rounded bg-[#7B2D8E] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">plus</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px]">🚲</span>
                <span className="text-[14px] text-text-primary leading-5">£0.79 delivery fee saving</span>
              </div>
              <div className="w-[42px] h-[18px] rounded bg-[#7B2D8E] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">plus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-surface mt-4">
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">Add disposable cutlery</span>
            <ToggleSwitch on={cutlery} onToggle={() => setCutlery(!cutlery)} />
          </div>
        </div>

        <SectionHeader title="Charity donation" />
        <div className="mx-4 border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
          <div className="flex items-start px-4 py-3 gap-3">
            <div className="w-[48px] h-[48px] bg-white border border-border-subtle rounded-lg flex items-center justify-center shrink-0">
              <div className="text-center">
                <div className="text-[8px] font-bold text-[#00A1A1] leading-tight">Trussell</div>
                <div className="text-[5px] text-text-muted leading-tight">Ending hunger together</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-text-primary leading-6">Donate to Trussell</p>
              <p className="text-[13px] text-text-muted leading-4 mt-0.5">Support local food banks to help people facing hunger in the UK today</p>
            </div>
          </div>
          <Divider inset />
          <div className="flex items-center px-4 py-3">
            <span className="flex-1 text-[16px] text-text-primary leading-6">Round up</span>
            <span className="text-[16px] text-text-primary mr-3">£{roundUpAmount.toFixed(2)}</span>
            <ToggleSwitch on={roundUp} onToggle={() => setRoundUp(!roundUp)} />
          </div>
          <Divider inset />
          <div className="px-4 py-3">
            <p className="text-[14px] text-text-muted leading-5 mb-2">Or donate more...</p>
            <div className="flex gap-2">
              {["2.00", "5.00", "10.00"].map((amt) => (
                <button key={amt} className="flex-1 h-10 border border-brand rounded-lg flex items-center justify-center">
                  <span className="text-[14px] font-bold text-brand">£{amt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      <div className="shrink-0 relative z-20">
        <div className="bg-bg-surface shadow-[0px_-2px_8px_0px_rgba(0,0,0,0.12)]">
          <div className="flex items-center px-4 py-2.5">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[16px] text-text-primary leading-6">Rider tip</span>
              <span className="text-[16px]">🙂</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-7 h-7 rounded-full border border-border-subtle flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8" stroke="#BAC3C3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v8M3 7h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-[16px] text-text-primary ml-1">£0.00</span>
            </div>
          </div>
          <Divider />
          <div className="flex items-center px-4 py-2.5">
            <span className="flex-1 text-[16px] font-bold text-text-primary leading-6">Order total</span>
            <span className="text-[16px] font-bold text-text-primary">£{orderTotal.toFixed(2)}</span>
          </div>
          <div className="mx-4 mt-1 mb-3 p-2.5 bg-[#E8F8F5] rounded-lg flex items-center justify-between">
            <span className="text-[13px] text-brand font-bold">You're saving a total of £{savings}!</span>
            <div className="w-6 h-6 rounded bg-brand flex items-center justify-center shrink-0">
              <span className="text-white text-[8px] font-bold">plus</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <button className="w-full h-12 bg-brand-button rounded flex items-center justify-center">
              <span className="text-[16px] font-bold text-brand-dark leading-6">Go to checkout</span>
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    </div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState("single");
  const [targetScreen, setTargetScreen] = useState("single");
  const [resetKey, setResetKey] = useState(0);
  const [orderData, setOrderData] = useState(null);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveScreen("single");
    setTargetScreen("single");
    setOrderData(null);
  };

  const navigateTo = (screen, data) => {
    if (data !== undefined) setOrderData(data);
    setTargetScreen(screen);
    setTimeout(() => setActiveScreen(screen), 300);
  };

  const showCheckout = targetScreen === "checkout";
  const itemTarget = showCheckout
    ? (activeScreen === "checkout" ? (orderData?.type === "meal" ? "upsell" : "single") : activeScreen)
    : targetScreen;
  const itemTranslateX = itemTarget === "upsell" ? "translateX(-100%)" : "translateX(0%)";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-black">
      <StatusBar onReset={handleReset} light={showCheckout} />

      <div className="relative flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <SheetTop />
          <div className="relative flex-1" key={resetKey}>
            <div
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
              style={{ transform: itemTranslateX }}
            >
              <div className="absolute inset-0" style={{ width: "200%", display: "flex" }}>
                <div style={{ width: "50%" }} className="h-full">
                  <SingleItemScreen onUpgrade={() => navigateTo("upsell")} onAdd={(data) => navigateTo("checkout", data)} />
                </div>
                <div style={{ width: "50%" }} className="h-full">
                  <ItemUpsellScreen onBack={() => navigateTo("single")} onAdd={(data) => navigateTo("checkout", data)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 z-50 transition-transform duration-300 ease-in-out"
          style={{ transform: showCheckout ? "translateX(0)" : "translateX(100%)" }}
          key={`checkout-${resetKey}`}
        >
          <CheckoutScreen order={orderData} onBack={() => navigateTo(orderData?.type === "meal" ? "upsell" : "single")} />
        </div>
      </div>
    </div>
  );
}
