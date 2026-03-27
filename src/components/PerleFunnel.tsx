"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Zap, Shield, CreditCard, User, Home, Activity, Smartphone, Car, Flame, Sun, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface TariffSelection {
    tariffName: string;
    tariffKey: string;
    providerName: string;
}

interface PriceQuote {
    name: string;
    priceComponents: {
        pricePerMonth: { value: number; unitText: string };
        unitPrice: { value: number; unitText: string };
        basePricePerMonth: { value: number; unitText: string };
        estimatedConsumption: { value: number; unitText: string };
    };
    durationPeriod: { value: number; unitText: string };
    noticePeriod: { value: number; unitText: string };
}

const HOUSEHOLD_SIZES = [
    { persons: 1, kwh: 1500 },
    { persons: 2, kwh: 2500 },
    { persons: 3, kwh: 3500 },
    { persons: 4, kwh: 4500 },
    { persons: 5, kwh: 5500 },
];

const STEP_LABELS = ["Tarifangebot", "Über dich", "Wechseldetails", "Zahlung", "Übersicht"];

export default function PerleFunnel() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [tariffs, setTariffs] = useState<TariffSelection[]>([]);
    const [selectedTariff, setSelectedTariff] = useState<TariffSelection | null>(null);
    const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);
    const [allPriceQuotes, setAllPriceQuotes] = useState<{[key: string]: PriceQuote}>({});
    const [showTariffDetail, setShowTariffDetail] = useState(false);
    
    // Geodata state for automatic address selection
    const [localities, setLocalities] = useState<any[]>([]);
    const [streets, setStreets] = useState<any[]>([]);
    const [geoLoading, setGeoLoading] = useState(false);
    
    // UI states for custom search dropdowns
    const [showStreetDropdown, setShowStreetDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [streetSearch, setStreetSearch] = useState("");
    const [citySearch, setCitySearch] = useState("");
    const [householdSize, setHouseholdSize] = useState(2);
    const [customerType, setCustomerType] = useState<"Private" | "Business">("Private");
    const [showPersonalFields, setShowPersonalFields] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        // Step 1
        postcode: "",
        usage: "2500",
        // Step 2: Personal
        email: "",
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "",
        password: "",
        phone: "",
        // Address
        street: "",
        houseNumber: "",
        city: "",
        // Step 3: Delivery
        meterNumber: "",
        maLoIdentifier: "",
        desiredTransitionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        moveInDate: "",
        previousSupplierCode: "",
        contractReason: "ChangeOfSupplier",
        // Step 4: Bank
        iban: "",
        bic: "",
        accountHolder: "",
        // Capabilities
        hasElectricVehicle: false,
        hasSmartMeter: false,
        hasHeatPump: false,
        hasPhotovoltaik: false,
        // Additional
        extension: "",
        title: "",
        businessName: "",
        // Campaign
        campaignCode: "",
    });

    // Fetch tariffs on mount
    useEffect(() => {
        fetch('/api/rabot/tariffs')
            .then(res => res.json())
            .then(data => {
                if (data.isSuccess) {
                    const sanitizedTariffs = data.data.map((t: any) => ({
                        ...t,
                        tariffName: t.tariffName.replace(/rabot/gi, 'Perle'),
                        providerName: t.providerName.replace(/rabot/gi, 'Perle')
                    }));
                    setTariffs(sanitizedTariffs);
                }
            }).catch(() => toast.error("Tarife konnten nicht geladen werden."));
    }, []);

    // Update usage when household size changes
    useEffect(() => {
        const match = HOUSEHOLD_SIZES.find(h => h.persons === householdSize);
        if (match) {
            setFormData(prev => ({ ...prev, usage: match.kwh.toString() }));
        }
    }, [householdSize]);

    // Load geodata when step 2 (personal info) starts
    useEffect(() => {
        if (showPersonalFields && formData.postcode && formData.postcode.length === 5) {
            const fetchGeo = async () => {
                setGeoLoading(true);
                try {
                    // Fetch Localities (Cities)
                    const locRes = await fetch(`/api/geo?postcode=${formData.postcode}&type=localities`);
                    const locData = await locRes.json();
                    setLocalities(locData);
                    
                    // Auto-fill city if only one
                    if (locData.length === 1 && !formData.city) {
                        setFormData(prev => ({ ...prev, city: locData[0].name }));
                    }

                    // Fetch Streets
                    const strRes = await fetch(`/api/geo?postcode=${formData.postcode}&type=streets`);
                    const strData = await strRes.json();
                    setStreets(strData);
                } catch (err) {
                    console.error("Geo fetch failed:", err);
                } finally {
                    setGeoLoading(false);
                }
            };
            fetchGeo();
        }
    }, [showPersonalFields, formData.postcode]);

    // Update internal search state when street changes from outside or reset
    useEffect(() => {
        setStreetSearch(formData.street);
    }, [formData.street]);

    useEffect(() => {
        setCitySearch(formData.city);
    }, [formData.city]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculatePrice = async (tariffToUse?: TariffSelection) => {
        setLoading(true);
        const previousTariff = selectedTariff;
        const previousQuote = priceQuote;
        try {
            const actualTariff = tariffToUse || selectedTariff || tariffs[0];
            setSelectedTariff(actualTariff);

            const res = await fetch('/api/rabot/calculate-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tariffKey: actualTariff.tariffKey,
                    zipCode: formData.postcode,
                    yearlyConsumptionKwh: parseInt(formData.usage),
                    hasSmartMeter: formData.hasSmartMeter,
                    hasElectricVehicle: formData.hasElectricVehicle
                })
            });
            const data = await res.json();
            if (data.isSuccess) {
                setPriceQuote(data.data);
                setShowTariffDetail(true);
                return true;
            } else {
                console.error("[PerleFunnel] Price calc failed:", data.message);
                if (previousTariff) setSelectedTariff(previousTariff);
                if (previousQuote) setPriceQuote(previousQuote);
                toast.error(data.message || "Preisberechnung fehlgeschlagen.");
                return false;
            }
        } catch (err) {
            console.error("[PerleFunnel] Price calc error:", err);
            if (previousTariff) setSelectedTariff(previousTariff);
            if (previousQuote) setPriceQuote(previousQuote);
            toast.error("Fehler bei der Preisberechnung.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateClick = async () => {
        if (!formData.postcode || formData.postcode.length !== 5) {
            toast.error("Bitte gib eine gültige 5-stellige PLZ ein.");
            return;
        }
        if (!formData.usage || parseInt(formData.usage) < 100) {
            toast.error("Bitte gib einen Verbrauch von mindestens 100 kWh an.");
            return;
        }
        // Calculate all tariffs to show comparison
        setLoading(true);
        try {
            const results: {[key: string]: PriceQuote} = {};
            
            // Fetch prices for all available tariffs
            const fetchPromises = tariffs.map(async (t) => {
                const res = await fetch('/api/rabot/calculate-price', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tariffKey: t.tariffKey,
                        zipCode: formData.postcode,
                        yearlyConsumptionKwh: parseInt(formData.usage),
                        hasSmartMeter: formData.hasSmartMeter,
                        hasElectricVehicle: formData.hasElectricVehicle
                    })
                });
                const data = await res.json();
                if (data.isSuccess) {
                    results[t.tariffKey] = data.data;
                }
            });

            await Promise.all(fetchPromises);
            setAllPriceQuotes(results);

            // Set the first one as default priceQuote for the detail view
            if (tariffs[0] && results[tariffs[0].tariffKey]) {
                setPriceQuote(results[tariffs[0].tariffKey]);
                setSelectedTariff(tariffs[0]);
            }
            
            setShowTariffDetail(false);
        } catch (err) {
            console.error("[PerleFunnel] Fetch all prices error:", err);
            toast.error("Fehler bei der Berechnung.");
        } finally {
            setLoading(false);
        }
    };

    const selectTariffAndShowDetail = async (tariff: TariffSelection) => {
        const success = await calculatePrice(tariff);
        if (success) {
            setShowTariffDetail(true);
        }
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (step === 1 && showTariffDetail) {
            setShowTariffDetail(false);
        } else if (step === 1 && priceQuote) {
            setPriceQuote(null);
            setShowTariffDetail(false);
        } else {
            setStep(prev => prev - 1);
        }
    };

    const submitOrder = async () => {
        setLoading(true);
        try {
            const orderPayload = {
                tariffKey: selectedTariff?.tariffKey,
                offerDate: new Date().toISOString().split('T')[0], // Mandatory: Today's date
                userAccount: {
                    emailAddress: formData.email,
                    phoneNumber: formData.phone,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    businessName: customerType === "Business" ? formData.businessName : null,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth
                },
                contract: {
                    externalId: `PERLE-${Date.now()}`,
                    type: customerType,
                    deliveryAddress: {
                        title: formData.title || null,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        businessName: customerType === "Business" ? formData.businessName : null,
                        gender: formData.gender,
                        extension: formData.extension || null,
                        streetName: formData.street,
                        houseNumber: formData.houseNumber,
                        city: formData.city,
                        postCode: formData.postcode,
                        countryCode: "DE"
                    },
                    billingAddress: null,
                    bankDetails: {
                        accountHolder: formData.accountHolder,
                        iban: formData.iban,
                        bic: formData.bic,
                        bankName: null,
                        hasAcceptedDirectDebit: true
                    },
                    contractReason: formData.contractReason,
                    deliveryDetails: {
                        meterNumber: formData.meterNumber,
                        maLoIdentifier: formData.maLoIdentifier || null,
                        meLoIdentifier: null,
                        desiredTransitionDate: formData.desiredTransitionDate,
                        moveInDate: formData.contractReason === "NewDeliveryLocation" ? formData.moveInDate : null,
                        previousSelfCancelledDate: null,
                        previousSupplierCode: formData.contractReason === "ChangeOfSupplier" ? formData.previousSupplierCode : null,
                        previousAnnualConsumptionkwh: parseInt(formData.usage),
                        capabilities: {
                            hasElectricVehicle: formData.hasElectricVehicle,
                            hasSmartMeter: formData.hasSmartMeter,
                            hasHeatPump: formData.hasHeatPump
                        }
                    },
                    agreements: {
                        termsAndConditions: true,
                        privacyPolicy: true,
                        revocationPolicy: true
                    },
                    transactionDateTime: null
                },
                campaignCode: formData.campaignCode || null
            };

            const res = await fetch('/api/rabot/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });
            const data = await res.json();
            if (data.isSuccess) {
                // Register customer locally for kundenportal login
                try {
                    await fetch('/api/auth/customer-register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password,
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            phone: formData.phone,
                            orderExternalId: orderPayload.contract.externalId
                        })
                    });
                } catch (regErr) {
                    console.error("Local registration failed:", regErr);
                    // We don't block the UI if local registration fails, since the order was successful on Rabot.
                }

                setStep(6); // Success step
                toast.success("Bestellung erfolgreich übermittelt!");
            } else {
                toast.error(data.message || "Bestellvorgang fehlgeschlagen.");
            }
        } catch (err) {
            toast.error("Fehler beim Senden der Bestellung.");
        } finally {
            setLoading(false);
        }
    };

    const progress = priceQuote ? ((step) / 5) * 100 : 0;

    // Helper for capability toggles in Step 1
    const CapabilityToggle = ({ icon: Icon, label, checked, onChange }: { icon: any; label: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${checked ? 'border-[#e8ac15] bg-[#e8ac15]/5' : 'border-[#202324]/5 hover:border-[#202324]/15'}`}
        >
            <Icon size={28} className={checked ? 'text-[#e8ac15]' : 'text-[#202324]/30'} />
            <span className={`text-xs font-bold ${checked ? 'text-[#202324]' : 'text-[#202324]/40'}`}>{label}</span>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'border-[#e8ac15] bg-[#e8ac15]' : 'border-[#202324]/15'}`}>
                {checked && <Check size={12} className="text-white" />}
            </div>
        </button>
    );

    const inputClass = "w-full bg-white border border-[#202324]/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] focus:border-[#e8ac15] font-bold placeholder:text-[#202324]/20 transition-all";
    const labelClass = "text-xs font-bold text-[#202324]/60 uppercase tracking-widest";

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Bar — shown from step 2 onwards */}
            {step >= 1 && priceQuote && step < 6 && (
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {STEP_LABELS.map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full transition-all ${i + 1 <= step ? 'bg-[#e8ac15]' : 'bg-[#202324]/10'}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline ${i + 1 <= step ? 'text-[#202324]/60' : 'text-[#202324]/20'}`}>{label}</span>
                                {i < STEP_LABELS.length - 1 && <div className={`w-8 h-0.5 ${i + 1 < step ? 'bg-[#e8ac15]' : 'bg-[#202324]/10'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-[#202324]/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
                
                {/* ==================== STEP 1: TARIFANGEBOT ==================== */}
                {step === 1 && !priceQuote && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4 text-center">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Finde das passende <span className="text-[#e8ac15]">Stromangebot.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Berechne jetzt, wie viel Du bei uns sparen kannst!</p>
                        </div>

                        {/* Household Size Selector */}
                        <div className="space-y-4">
                            <label className={labelClass}>Haushaltsgröße oder Stromverbrauch angeben</label>
                            <div className="flex items-center justify-center gap-6">
                                <button type="button" onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))} className="w-12 h-12 rounded-full border-2 border-[#e8ac15] flex items-center justify-center text-[#e8ac15] hover:bg-[#e8ac15]/10 transition-all">
                                    <Minus size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <User size={20} className="text-[#202324]/40" />
                                    <span className="text-xl font-bold text-[#202324]">{householdSize} {householdSize === 1 ? 'Person' : 'Personen'}</span>
                                </div>
                                <button type="button" onClick={() => setHouseholdSize(Math.min(5, householdSize + 1))} className="w-12 h-12 rounded-full border-2 border-[#e8ac15] flex items-center justify-center text-[#e8ac15] hover:bg-[#e8ac15]/10 transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className={labelClass}>Stromverbrauch (kWh)</label>
                                <div className="relative">
                                    <Zap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#202324]/20" />
                                    <input
                                        required
                                        type="number"
                                        name="usage"
                                        value={formData.usage}
                                        onChange={handleChange}
                                        placeholder="2500"
                                        className={`${inputClass} pl-10`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#202324]/30 font-bold text-sm">kWh</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>PLZ</label>
                                <input
                                    required
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleChange}
                                    placeholder="z.B. 10115"
                                    maxLength={5}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Capability Checkboxes */}
                        <div className="space-y-4">
                            <label className={labelClass}>Nutzt Du in Deinem Haushalt folgende Dinge?</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <CapabilityToggle icon={Smartphone} label="Smart Meter" checked={formData.hasSmartMeter} onChange={(v) => setFormData(prev => ({...prev, hasSmartMeter: v}))} />
                                <CapabilityToggle icon={Car} label="Elektro-Auto" checked={formData.hasElectricVehicle} onChange={(v) => setFormData(prev => ({...prev, hasElectricVehicle: v}))} />
                                <CapabilityToggle icon={Flame} label="Wärmepumpe" checked={formData.hasHeatPump} onChange={(v) => setFormData(prev => ({...prev, hasHeatPump: v}))} />
                                <CapabilityToggle icon={Sun} label="Photovoltaik" checked={formData.hasPhotovoltaik} onChange={(v) => setFormData(prev => ({...prev, hasPhotovoltaik: v}))} />
                            </div>
                        </div>

                        {/* Calculate Button */}
                        <button
                            type="button"
                            onClick={handleCalculateClick}
                            disabled={loading || tariffs.length === 0}
                            className={`w-full flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group ${loading ? 'bg-[#202324]/10 cursor-not-allowed text-[#202324]/20' : 'bg-[#e8ac15] text-[#202324] hover:bg-[#202324] hover:text-white'}`}
                        >
                            {loading ? 'Berechne...' : 'Jetzt unverbindlich berechnen'}
                            {!loading && <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                )}

                {/* TARIFF COMPARISON LIST */}
                {step === 1 && priceQuote && !showTariffDetail && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4 text-center">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Alle Stromtarife im <span className="text-[#e8ac15]">Vergleich.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">
                                Für {formData.usage} kWh in {formData.postcode}
                                {formData.hasElectricVehicle ? ' mit E-Auto' : ' ohne E-Auto'}
                                {formData.hasSmartMeter ? ' und mit Smart-Meter' : ' und ohne Smart-Meter'}
                                <button type="button" onClick={() => { setPriceQuote(null); setShowTariffDetail(false); }} className="ml-2 text-[#e8ac15] hover:underline">✏️</button>
                            </p>
                        </div>

                        {/* Campaign Code */}
                        <div className="text-center space-y-2">
                            <p className="text-sm font-bold text-[#202324]/60">Hast du einen Gutschein- oder Empfehlungscode erhalten?</p>
                            <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
                                <input
                                    type="text"
                                    name="campaignCode"
                                    value={formData.campaignCode}
                                    onChange={handleChange}
                                    placeholder="Code eingeben"
                                    className={`${inputClass} text-center`}
                                />
                                <button type="button" className="px-6 py-4 rounded-xl border-2 border-[#202324]/10 font-bold text-sm text-[#202324]/60 hover:border-[#e8ac15] transition-all">
                                    Einlösen
                                </button>
                            </div>
                        </div>

                        {/* Tariff Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {tariffs.map((t, index) => {
                                const labels: { [key: number]: { badge: string; highlight?: boolean } } = {
                                    0: { badge: "Maximal flexibel" },
                                    1: { badge: "Am beliebtesten", highlight: true },
                                    2: { badge: "Feste Preise" },
                                };
                                const tariffLabel = labels[index] || { badge: t.tariffName };

                                return (
                                    <div key={t.tariffKey} className={`relative p-8 rounded-2xl border-2 transition-all ${tariffLabel.highlight ? 'border-[#e8ac15] bg-[#e8ac15]/5' : 'border-[#202324]/5 hover:border-[#202324]/15'}`}>
                                        <div className="space-y-4">
                                            <h4 className="font-black text-xl text-[#202324]">{t.tariffName}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${tariffLabel.highlight ? 'bg-[#e8ac15] text-[#202324]' : 'bg-[#202324]/5 text-[#202324]/60'}`}>
                                                    {tariffLabel.badge}
                                                </span>
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-4xl font-black text-[#202324]">
                                                    {allPriceQuotes[t.tariffKey]?.priceComponents.pricePerMonth.value.toFixed(2) || "—"}
                                                </span>
                                                <span className="text-sm text-[#202324]/40 font-medium ml-2">€ pro Monat</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => selectTariffAndShowDetail(t)}
                                                disabled={loading}
                                                className={`w-full py-4 rounded-xl font-bold transition-all ${loading ? 'bg-[#202324]/5 text-[#202324]/20' : 'bg-[#e8ac15] text-[#202324] hover:bg-[#202324] hover:text-white'}`}
                                            >
                                                {loading ? 'Lade...' : 'Auswählen'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TARIFF DETAIL VIEW */}
                {step === 1 && priceQuote && showTariffDetail && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4 text-center">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Alle Stromtarife im <span className="text-[#e8ac15]">Vergleich.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">
                                Für {formData.usage} kWh in {formData.postcode}
                            </p>
                        </div>

                        <button type="button" onClick={() => setShowTariffDetail(false)} className="text-[#e8ac15] font-bold flex items-center gap-2 hover:underline">
                            <ArrowLeft size={16} /> zurück zur Tarifauswahl
                        </button>

                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-[#202324]">Dein ausgewählter Tarif</h4>
                        </div>

                        <div className="bg-[#202324] text-white rounded-[2rem] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-[#e8ac15]/10 group-hover:text-[#e8ac15]/20 transition-colors pointer-events-none">
                                <Zap size={120} strokeWidth={1} />
                            </div>
                            
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="font-black text-xl mb-1">{selectedTariff?.tariffName}</h4>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-white/50">Aktueller Tarif</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-7xl font-black tracking-tighter">{priceQuote.priceComponents.pricePerMonth.value.toFixed(2)}</span>
                                        <span className="text-2xl font-bold opacity-30">€ / Mon.</span>
                                    </div>
                                    <button type="button" className="text-[#e8ac15] font-bold text-sm hover:underline">Tarif- und Preisdetails</button>
                                </div>

                                <div className="space-y-4 flex flex-col justify-center border-l border-white/5 pl-0 md:pl-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Check className="text-[#e8ac15]" size={18} />
                                            <span className="text-sm font-medium text-white/60">Arbeitspreis: <b>{priceQuote.priceComponents.unitPrice.value.toFixed(2)} {priceQuote.priceComponents.unitPrice.unitText}</b></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Check className="text-[#e8ac15]" size={18} />
                                            <span className="text-sm font-medium text-white/60">Grundpreis: <b>{priceQuote.priceComponents.basePricePerMonth.value.toFixed(2)} {priceQuote.priceComponents.basePricePerMonth.unitText}</b></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Check className="text-[#e8ac15]" size={18} />
                                            <span className="text-sm font-medium text-white/60">Laufzeit: <b>{priceQuote.durationPeriod.value} {priceQuote.durationPeriod.unitText}</b></span>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <span className="bg-white/5 text-white/40 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">Öko-zertifiziert</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weiter Button */}
                        <div className="flex items-center justify-between pt-4">
                            <div />
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324]"
                            >
                                Weiter <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ==================== STEP 2: ÜBER DICH ==================== */}
                {step === 2 && (
                    <div className="space-y-10 animate-fade-in">
                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 pb-4">
                            {[
                                { label: "Ausfüllen in wenigen Minuten", icon: <Check size={14} /> },
                                { label: "Geprüfte Datensicherheit", icon: <Shield size={14} /> },
                                { label: "Kompetenter Support", icon: <Check size={14} /> }
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-lg border border-[#202324]/5">
                                    <div className="text-green-500">{badge.icon}</div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#202324]/60">{badge.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 text-center">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Über <span className="text-[#e8ac15]">dich.</span></h3>
                        </div>

                        {!showPersonalFields ? (
                            <form onSubmit={(e) => { e.preventDefault(); if(formData.email) setShowPersonalFields(true); }} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-[#202324] rounded-lg flex items-center justify-center text-white">
                                            <User size={16} />
                                        </div>
                                        <h4 className="font-bold text-[#202324]">Deine E-Mail Adresse</h4>
                                    </div>
                                    <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 space-y-6">
                                        <div className="space-y-3">
                                            <label className={labelClass}>E-Mail</label>
                                            <input 
                                                required 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleChange} 
                                                type="email" 
                                                placeholder="mail@beispiel.de" 
                                                className={inputClass} 
                                            />
                                            <p className="text-[#e8ac15] text-[10px] font-bold cursor-help hover:underline">Wofür brauchen wir diese Info?</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-[#202324]/40 font-medium leading-relaxed">
                                    Mit klicken auf "Weiter" bestätigst du, dass Du unsere <Link href="/datenschutz" className="text-green-500 font-bold hover:underline">Datenschutzbestimmungen</Link> zur Kenntnis genommen hast. Wir schicken dir eine Bestätigungsmail. Bitte überprüfe Dein E-Mail-Postfach und Deinen Spam Ordner und klicke auf den Link um Deine E-Mail Adresse zu verifizieren.
                                </p>

                                <div className="flex items-center justify-center pt-6">
                                    <button 
                                        type="submit" 
                                        className="w-full md:w-auto min-w-[300px] flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl bg-[#e8ac15] text-[#202324] hover:bg-[#202324] hover:text-white"
                                    >
                                        Weiter
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10">
                                {/* Email Static with Change button */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-[#202324] rounded-lg flex items-center justify-center text-white">
                                            <User size={16} />
                                        </div>
                                        <h4 className="font-bold text-[#202324]">Deine E-Mail Adresse</h4>
                                    </div>
                                    <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 flex items-center justify-between border-l-4 border-[#e8ac15]">
                                        <div>
                                            <label className={labelClass}>E-Mail</label>
                                            <p className="font-bold text-[#202324]">{formData.email}</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPersonalFields(false)}
                                            className="px-6 py-3 bg-[#e8ac15] text-[#202324] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#202324] hover:text-white transition-all shadow-sm"
                                        >
                                            Ändern
                                        </button>
                                    </div>
                                </div>

                                {/* Personal Data Fields */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-transparent border border-[#202324]/10 rounded-lg flex items-center justify-center text-[#202324]/40">
                                            <User size={16} />
                                        </div>
                                        <h4 className="font-bold text-[#202324]">Persönliche Daten</h4>
                                    </div>

                                    <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 space-y-8">
                                        {/* Toggle */}
                                        <div className="flex rounded-xl overflow-hidden border border-[#202324]/5 w-fit">
                                            <button type="button" onClick={() => setCustomerType("Private")} className={`px-8 py-3 font-bold text-sm transition-all ${customerType === "Private" ? 'bg-[#e8ac15] text-[#202324]' : 'bg-white text-[#202324]/40 hover:bg-slate-50'}`}>
                                                Privat
                                            </button>
                                            <button type="button" onClick={() => setCustomerType("Business")} className={`px-8 py-3 font-bold text-sm transition-all ${customerType === "Business" ? 'bg-[#e8ac15] text-[#202324]' : 'bg-white text-[#202324]/40 hover:bg-slate-50'}`}>
                                                Gewerbe
                                            </button>
                                        </div>

                                        {customerType === "Business" && (
                                            <div className="space-y-3 animate-fade-in">
                                                <label className={labelClass}>Firmenname</label>
                                                <input required name="businessName" value={formData.businessName} onChange={handleChange} type="text" className={inputClass} />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className={labelClass}>Anrede</label>
                                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                                    <option value="Female">Frau</option>
                                                    <option value="Male">Herr</option>
                                                    <option value="Other">Divers</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className={labelClass}>Telefonnummer</label>
                                                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+49..." className={inputClass} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className={labelClass}>Vorname</label>
                                                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className={inputClass} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className={labelClass}>Nachname</label>
                                                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className={inputClass} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className={labelClass}>Geburtsdatum</label>
                                                <input required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" className={inputClass} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-transparent border border-[#202324]/10 rounded-lg flex items-center justify-center text-[#202324]/40">
                                            <Home size={16} />
                                        </div>
                                        <h4 className="font-bold text-[#202324]">Deine Lieferadresse</h4>
                                    </div>
                                    <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 grid grid-cols-3 gap-6">
                                                <div className="col-span-2 space-y-3 relative">
                                                    <label className={labelClass}>Straße</label>
                                                    <div className="relative">
                                                        <input 
                                                            required 
                                                            name="street" 
                                                            autoComplete="off"
                                                            value={streetSearch} 
                                                            onFocus={() => setShowStreetDropdown(true)}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setStreetSearch(val);
                                                                setFormData(prev => ({ ...prev, street: val }));
                                                                setShowStreetDropdown(true);
                                                            }} 
                                                            type="text" 
                                                            placeholder="Straße suchen..." 
                                                            className={`${inputClass} ${streets.length > 0 && !streets.some(s => s.name === streetSearch) && streetSearch.length > 3 ? 'border-orange-200' : ''}`} 
                                                        />
                                                        {showStreetDropdown && streets.length > 0 && (
                                                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#202324]/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                                {streets
                                                                    .filter(s => s.name.toLowerCase().includes(streetSearch.toLowerCase()))
                                                                    .slice(0, 50)
                                                                    .map((s, idx) => (
                                                                        <button 
                                                                            key={`${s.name}-${idx}`}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setStreetSearch(s.name);
                                                                                setFormData(prev => ({ ...prev, street: s.name }));
                                                                                setShowStreetDropdown(false);
                                                                            }}
                                                                            className="w-full px-5 py-4 text-left text-sm font-bold text-[#202324] hover:bg-[#e8ac15]/10 hover:text-[#e8ac15] transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between group"
                                                                        >
                                                                            {s.name}
                                                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-1 transition-all" />
                                                                        </button>
                                                                    ))}
                                                                {streets.filter(s => s.name.toLowerCase().includes(streetSearch.toLowerCase())).length === 0 && (
                                                                    <div className="px-5 py-6 text-xs text-[#202324]/40 font-bold italic">Keine Straße gefunden.</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Backdrop for closing dropdown */}
                                                        {showStreetDropdown && (
                                                            <div className="fixed inset-0 z-40" onClick={() => setShowStreetDropdown(false)} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className={labelClass}>Hausnr.</label>
                                                    <input required name="houseNumber" value={formData.houseNumber} onChange={handleChange} type="text" placeholder="1" className={inputClass} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className={labelClass}>PLZ</label>
                                                <input required name="postcode" value={formData.postcode} disabled type="text" className={`${inputClass} opacity-50 cursor-not-allowed`} />
                                            </div>
                                            <div className="space-y-3 relative">
                                                <label className={labelClass}>Stadt</label>
                                                <div className="relative">
                                                    <input 
                                                        required 
                                                        name="city" 
                                                        autoComplete="off"
                                                        value={citySearch} 
                                                        onFocus={() => setShowCityDropdown(true)}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setCitySearch(val);
                                                            setFormData(prev => ({ ...prev, city: val }));
                                                            setShowCityDropdown(true);
                                                        }} 
                                                        type="text" 
                                                        className={inputClass} 
                                                    />
                                                    {showCityDropdown && localities.length > 1 && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white border border-[#202324]/10 rounded-2xl shadow-2xl max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                            {localities
                                                                .filter(l => l.name.toLowerCase().includes(citySearch.toLowerCase()))
                                                                .map((l, idx) => (
                                                                    <button 
                                                                        key={`${l.name}-${idx}`}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setCitySearch(l.name);
                                                                            setFormData(prev => ({ ...prev, city: l.name }));
                                                                            setShowCityDropdown(false);
                                                                        }}
                                                                        className="w-full px-5 py-4 text-left text-sm font-bold text-[#202324] hover:bg-[#e8ac15]/10 hover:text-[#e8ac15] transition-colors"
                                                                    >
                                                                        {l.name}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                    {showCityDropdown && localities.length > 1 && (
                                                        <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-transparent border border-[#202324]/10 rounded-lg flex items-center justify-center text-[#202324]/40">
                                            <Shield size={16} />
                                        </div>
                                        <h4 className="font-bold text-[#202324]">Dein Passwort</h4>
                                    </div>
                                    <div className="bg-[#f2f2f2] rounded-2xl p-6 md:p-8 space-y-3">
                                        <label className={labelClass}>Passwort festlegen</label>
                                        <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="********" className={inputClass} />
                                        <p className="text-[10px] text-[#202324]/30 font-bold uppercase tracking-widest">Mind. 8 Zeichen, eine Zahl, ein Groß- und ein Kleinbuchstabe.</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-[#202324]/40 hover:text-[#202324] font-bold transition-colors group">
                                        <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Zurück
                                    </button>
                                    <button type="submit" disabled={loading} className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324]">
                                        Weiter <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* ==================== STEP 3: WECHSELDETAILS ==================== */}
                {step === 3 && (
                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Wechsel<span className="text-[#e8ac15]">details.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Details zu deiner Stromversorgung und deinem Wechsel.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className={labelClass}>Anlass</label>
                                <select required name="contractReason" value={formData.contractReason} onChange={handleChange} className={inputClass}>
                                    <option value="ChangeOfSupplier">Anbieterwechsel</option>
                                    <option value="NewDeliveryLocation">Umzug / Neueinzug</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>Zählernummer</label>
                                <input required name="meterNumber" value={formData.meterNumber} onChange={handleChange} type="text" placeholder="z.B. 12345678" className={inputClass} />
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>MaLo-ID (Optional)</label>
                                <input name="maLoIdentifier" value={formData.maLoIdentifier} onChange={handleChange} type="text" placeholder="Marktlokations-ID" className={inputClass} />
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>Gewünschter Wechseltermin</label>
                                <input required name="desiredTransitionDate" value={formData.desiredTransitionDate} onChange={handleChange} type="date" className={inputClass} />
                            </div>
                            {formData.contractReason === "NewDeliveryLocation" && (
                                <div className="space-y-3">
                                    <label className={labelClass}>Einzugsdatum</label>
                                    <input required name="moveInDate" value={formData.moveInDate} onChange={handleChange} type="date" className={inputClass} />
                                </div>
                            )}
                            {formData.contractReason === "ChangeOfSupplier" && (
                                <div className="space-y-3">
                                    <label className={labelClass}>Bisheriger Anbieter Code (BDEW)</label>
                                    <input required name="previousSupplierCode" value={formData.previousSupplierCode} onChange={handleChange} type="text" placeholder="z.B. 9979250000006" className={inputClass} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <button type="button" onClick={prevStep} className="flex items-center gap-2 text-[#202324]/40 hover:text-[#202324] font-bold transition-colors group">
                                <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Zurück
                            </button>
                            <button type="submit" className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324]">
                                Weiter <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                )}

                {/* ==================== STEP 4: ZAHLUNG ==================== */}
                {step === 4 && (
                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Zahlung.</h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Wir ziehen die monatlichen Abschläge bequem via SEPA-Lastschrift ein.</p>
                        </div>

                        <div className="bg-slate-50 border border-[#202324]/5 p-8 rounded-2xl flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#202324]">
                                <Shield size={24} />
                            </div>
                            <p className="text-sm text-[#202324]/60 font-medium leading-relaxed">
                                Deine Bankdaten sind bei uns sicher. Der Einzug erfolgt erst nach Vertragsbestätigung und zum vereinbarten Datum.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-3">
                                <label className={labelClass}>Kontoinhaber</label>
                                <input required name="accountHolder" value={formData.accountHolder} onChange={handleChange} type="text" placeholder="Max Mustermann" className={inputClass} />
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>IBAN</label>
                                <input required name="iban" value={formData.iban} onChange={handleChange} type="text" placeholder="DE00 0000 0000 0000 0000 00" className={inputClass} />
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>BIC</label>
                                <input required name="bic" value={formData.bic} onChange={handleChange} type="text" placeholder="DEUTDEFF" className={inputClass} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <button type="button" onClick={prevStep} className="flex items-center gap-2 text-[#202324]/40 hover:text-[#202324] font-bold transition-colors group">
                                <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Zurück
                            </button>
                            <button type="submit" className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324]">
                                Weiter <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                )}

                {/* ==================== STEP 5: ÜBERSICHT ==================== */}
                {step === 5 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Übersicht.</h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Prüfe deine Angaben und bestätige deine Bestellung.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><Zap size={14} /> Tarif</h4>
                                    <p className="font-bold text-[#202324]">{selectedTariff?.tariffName}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">
                                        {priceQuote?.priceComponents.pricePerMonth.value.toFixed(2)} € / Monat
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><User size={14} /> Persönliche Daten</h4>
                                    <p className="font-bold text-[#202324]">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">{formData.email}</p>
                                    {formData.phone && <p className="text-sm font-medium text-[#202324]/60">{formData.phone}</p>}
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><Home size={14} /> Lieferadresse</h4>
                                    <p className="font-bold text-[#202324]">{formData.street} {formData.houseNumber}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">{formData.postcode} {formData.city}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><Activity size={14} /> Wechseldetails</h4>
                                    <p className="font-bold text-[#202324]">{formData.contractReason === 'ChangeOfSupplier' ? 'Anbieterwechsel' : 'Umzug'}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">Zähler: {formData.meterNumber}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">Wechseltermin: {formData.desiredTransitionDate}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><CreditCard size={14} /> Zahlung</h4>
                                    <p className="font-bold text-[#202324]">{formData.accountHolder}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">IBAN: {formData.iban.substring(0, 4)} **** ****</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                <input type="checkbox" required className="mt-1 accent-[#e8ac15]" id="agb" />
                                <label htmlFor="agb" className="text-sm font-medium text-[#202324]/60 leading-relaxed">
                                    Ich habe die <strong>AGB</strong>, die <strong>Widerrufsbelehrung</strong> sowie die <strong>Datenschutzbestimmungen</strong> gelesen und akzeptiere diese.
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <button type="button" onClick={prevStep} className="flex items-center gap-2 text-[#202324]/40 hover:text-[#202324] font-bold transition-colors group">
                                <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Zurück
                            </button>
                            <button
                                type="button"
                                onClick={submitOrder}
                                disabled={loading}
                                className={`flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group ${loading ? 'bg-[#202324]/10 cursor-not-allowed text-[#202324]/20' : 'bg-[#e8ac15] text-[#202324] hover:bg-[#202324] hover:text-white'}`}
                            >
                                {loading ? 'Verarbeite...' : 'Jetzt verbindlich abschließen'}
                                {!loading && <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* ==================== STEP 6: SUCCESS ==================== */}
                {step === 6 && (
                    <div className="text-center py-20 space-y-10 animate-fade-in">
                        <div className="w-24 h-24 bg-[#e8ac15] rounded-full mx-auto flex items-center justify-center text-white shadow-[0_20px_40px_rgba(232,172,21,0.3)]">
                            <Check size={48} strokeWidth={3} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-5xl font-black tracking-tight text-[#202324]">Willkommen bei <span className="text-[#e8ac15]">Perle!</span></h3>
                            <p className="text-xl text-[#202324]/50 font-medium max-w-sm mx-auto">Vielen Dank für deine Bestellung. Wir prüfen nun deine Daten und melden uns in Kürze per E-Mail.</p>
                        </div>
                        <div className="pt-10">
                            <button 
                                type="button"
                                onClick={() => window.location.href = '/'}
                                className="bg-[#202324] text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-[#e8ac15] hover:text-[#202324] transition-all duration-300"
                            >
                                Zurück zur Startseite
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#202324]/20 mt-12 pb-20">
                Sicherer Datentransfer mit 256-Bit SSL-Verschlüsselung
            </p>
        </div>
    );
}
