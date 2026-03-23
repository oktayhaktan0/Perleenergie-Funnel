"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Check, Zap, Smartphone, Leaf, Shield, CreditCard, User, Home, Activity } from "lucide-react";
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

export default function PerleFunnel() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [tariffs, setTariffs] = useState<TariffSelection[]>([]);
    const [selectedTariff, setSelectedTariff] = useState<TariffSelection | null>(null);
    const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        // Step 1
        postcode: "",
        usage: "2500",
        // Step 3: Personal
        email: "",
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "",
        password: "",
        phone: "",
        // Step 4: Address
        street: "",
        houseNumber: "",
        city: "",
        // Step 5: Delivery
        meterNumber: "",
        maLoIdentifier: "",
        desiredTransitionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 2 weeks out
        moveInDate: "",
        previousSupplierCode: "",
        contractReason: "ChangeOfSupplier", // or NewDeliveryLocation
        // Step 6: Bank
        iban: "",
        bic: "",
        accountHolder: "",
        // Capabilities
        hasElectricVehicle: false,
        hasSmartMeter: false,
        hasHeatPump: false,
        // Additional Address
        extension: "",
        title: "",
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
            })
            .catch(err => console.error("Error fetching tariffs", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1 && (!formData.postcode || !formData.usage)) {
            toast.error("Bitte gib Postleitzahl und Verbrauch ein.");
            return;
        }

        if (step === 1) {
            calculatePrice();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const calculatePrice = async () => {
        setLoading(true);
        try {
            // First select default tariff if none selected
            const tariffToUse = selectedTariff || tariffs[0];
            setSelectedTariff(tariffToUse);

            const res = await fetch('/api/rabot/calculate-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tariffKey: tariffToUse.tariffKey,
                    zipCode: formData.postcode,
                    yearlyConsumptionKwh: parseInt(formData.usage),
                    hasSmartMeter: formData.hasSmartMeter,
                    hasElectricVehicle: formData.hasElectricVehicle
                })
            });
            const data = await res.json();
            if (data.isSuccess) {
                setPriceQuote(data.data);
                setStep(2);
            } else {
                toast.error("Preisberechnung fehlgeschlagen.");
            }
        } catch (err) {
            toast.error("Fehler bei der Preisberechnung.");
        } finally {
            setLoading(false);
        }
    };

    const submitOrder = async () => {
        setLoading(true);
        try {
            const orderPayload = {
                tariffKey: selectedTariff?.tariffKey,
                userAccount: {
                    emailAddress: formData.email,
                    phoneNumber: formData.phone,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    businessName: null, // Can be expanded for B2B if needed
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth
                },
                contract: {
                    externalId: `PERLE-${Date.now()}`,
                    type: "Private",
                    deliveryAddress: {
                        title: formData.title || null,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        businessName: null,
                        gender: formData.gender,
                        extension: formData.extension || null,
                        streetName: formData.street,
                        houseNumber: formData.houseNumber,
                        city: formData.city,
                        postCode: formData.postcode,
                        countryCode: "DE"
                    },
                    billingAddress: null, // Same as delivery address
                    bankDetails: {
                        accountHolder: formData.accountHolder,
                        iban: formData.iban,
                        bic: formData.bic,
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
                    transactionDateTime: new Date().toISOString()
                },
                campaignCode: null
            };

            const res = await fetch('/api/rabot/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });
            const data = await res.json();
            if (data.isSuccess) {
                setStep(8); // Success step
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

    const progress = (step / 7) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Bar */}
            {step < 8 && (
                <div className="mb-12">
                    <div className="h-1.5 w-full bg-[#202324]/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#e8ac15] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-extrabold uppercase tracking-widest text-[#202324]/30">
                        <span>Schritt {step} von 7</span>
                        <span>{Math.round(progress)}% Abgeschlossen</span>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <form onSubmit={(e) => { e.preventDefault(); step === 7 ? submitOrder() : nextStep(); }} className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-[#202324]/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
                
                {step === 1 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Berechne deinen <span className="text-[#e8ac15]">Ökostrom-Vorteil.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Gib deine Postleitzahl und deinen ungefähren Jahresverbrauch an.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#202324]/60 uppercase tracking-widest">Postleitzahl</label>
                                <input
                                    required
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleChange}
                                    placeholder="z.B. 10115"
                                    className="w-full bg-[#f2f2f2] border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#e8ac15] transition-all font-bold text-xl placeholder:text-[#202324]/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#202324]/60 uppercase tracking-widest">Jahresverbrauch (kWh)</label>
                                <input
                                    required
                                    type="number"
                                    name="usage"
                                    value={formData.usage}
                                    onChange={handleChange}
                                    placeholder="2500"
                                    className="w-full bg-[#f2f2f2] border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#e8ac15] transition-all font-bold text-xl placeholder:text-[#202324]/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[1500, 2500, 3500, 5000].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, usage: val.toString() }))}
                                    className={`py-4 rounded-xl font-bold transition-all ${formData.usage === val.toString() ? 'bg-[#202324] text-white shadow-lg' : 'bg-slate-50 text-[#202324]/40 hover:bg-slate-100 border border-[#202324]/5'}`}
                                >
                                    {val} kWh
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && priceQuote && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Dein <span className="text-[#e8ac15]">Angebot</span> steht.</h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Beste Konditionen für saubere Energie in {formData.postcode}.</p>
                        </div>

                        <div className="bg-[#202324] text-white rounded-[2rem] p-10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 text-[#e8ac15]/10 group-hover:text-[#e8ac15]/20 transition-colors pointer-events-none">
                                <Zap size={120} strokeWidth={1} />
                            </div>
                            
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <div className="text-[#e8ac15] font-black text-xs uppercase tracking-[0.2em] mb-4">Monatliche Kosten</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-7xl font-black tracking-tighter">{priceQuote.priceComponents.pricePerMonth.value.toFixed(2)}</span>
                                            <span className="text-2xl font-bold opacity-30">€ / Mon.</span>
                                        </div>
                                    </div>
                                    
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
                                </div>

                                <div className="space-y-4 flex flex-col justify-center border-l border-white/5 pl-0 md:pl-10">
                                    <h4 className="font-bold text-xl uppercase tracking-widest text-[#e8ac15]">{selectedTariff?.tariffName}</h4>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                                        Dieser Tarif basiert auf echtem Ökostrom und bietet dir maximale Flexibilität bei vollem Preisschutz.
                                    </p>
                                    <div className="pt-4">
                                        <span className="bg-white/5 text-white/40 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">Öko-zertifiziert</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {tariffs.map(t => (
                               <button 
                                key={t.tariffKey}
                                onClick={() => {
                                    setSelectedTariff(t);
                                    calculatePrice();
                                }}
                                className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedTariff?.tariffKey === t.tariffKey ? 'border-[#e8ac15] bg-[#e8ac15]/5' : 'border-[#202324]/5 hover:border-[#202324]/20'}`}
                               >
                                   <div className="text-left">
                                       <div className="font-bold text-[#202324]">{t.tariffName}</div>
                                       <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#202324]/30">{t.providerName}</div>
                                   </div>
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedTariff?.tariffKey === t.tariffKey ? 'border-[#e8ac15] bg-[#e8ac15]' : 'border-[#202324]/10'}`}>
                                       {selectedTariff?.tariffKey === t.tariffKey && <Check size={14} className="text-[#202324]" />}
                                   </div>
                               </button>
                           ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Über <span className="text-[#e8ac15]">dich.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Lass uns wissen, wer du bist.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Anrede</label>
                                <select 
                                    name="gender" 
                                    value={formData.gender} 
                                    onChange={handleChange}
                                    className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold"
                                >
                                    <option value="Male">Herr</option>
                                    <option value="Female">Frau</option>
                                    <option value="Other">Divers</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">E-Mail Adresse</label>
                                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="mail@beispiel.de" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Vorname</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Nachname</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Geburtsdatum</label>
                                <input required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Passwort festlegen</label>
                                <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="********" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Lieferadresse.</h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Wo dürfen wir den Ökostrom liefern?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1 space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Straße</label>
                                <input required name="street" value={formData.street} onChange={handleChange} type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Hausnummer</label>
                                <input required name="houseNumber" value={formData.houseNumber} onChange={handleChange} type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Stadt</label>
                                <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Postleitzahl</label>
                                <input required name="postcode" value={formData.postcode} disabled type="text" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold opacity-50 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Zähler & <span className="text-[#e8ac15]">Anschluss.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Details zu deiner Stromversorgung.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Zählernummer</label>
                                <input required name="meterNumber" value={formData.meterNumber} onChange={handleChange} type="text" placeholder="z.B. 12345678" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">MaLo-ID (Optional)</label>
                                <input name="maLoIdentifier" value={formData.maLoIdentifier} onChange={handleChange} type="text" placeholder="33 значная ID" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Anlass</label>
                                <select required name="contractReason" value={formData.contractReason} onChange={handleChange} className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold">
                                    <option value="ChangeOfSupplier">Anbieterwechsel</option>
                                    <option value="NewDeliveryLocation">Umzug</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Wunschtermin</label>
                                <input required name="desiredTransitionDate" value={formData.desiredTransitionDate} onChange={handleChange} type="date" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                            </div>
                            {formData.contractReason === "NewDeliveryLocation" && (
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Einzugsdatum</label>
                                    <input required name="moveInDate" value={formData.moveInDate} onChange={handleChange} type="date" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                                </div>
                            )}
                            {formData.contractReason === "ChangeOfSupplier" && (
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Bisheriger Anbieter Code (BDEW)</label>
                                    <input required name="previousSupplierCode" value={formData.previousSupplierCode} onChange={handleChange} type="text" placeholder="z.B. 99000..." className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                                </div>
                            )}
                            
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <label className="flex items-center gap-3 p-4 bg-[#f2f2f2] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" checked={formData.hasElectricVehicle} onChange={(e) => setFormData(prev => ({...prev, hasElectricVehicle: e.target.checked}))} className="accent-[#e8ac15]" />
                                    <span className="text-sm font-bold">E-Auto?</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-[#f2f2f2] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" checked={formData.hasSmartMeter} onChange={(e) => setFormData(prev => ({...prev, hasSmartMeter: e.target.checked}))} className="accent-[#e8ac15]" />
                                    <span className="text-sm font-bold">Smart Meter?</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-[#f2f2f2] rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" checked={formData.hasHeatPump} onChange={(e) => setFormData(prev => ({...prev, hasHeatPump: e.target.checked}))} className="accent-[#e8ac15]" />
                                    <span className="text-sm font-bold">Wärmepumpe?</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Bezahlung.</h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Wir ziehen die monatlichen Abschläge bequem via SEPA-Lastschrift ein.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-50 border border-[#202324]/5 p-8 rounded-2xl flex items-center gap-6">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#202324]">
                                    <Shield size={24} />
                                </div>
                                <p className="text-sm text-[#202324]/60 font-medium leading-relaxed">
                                    Ihre Bankdaten sind bei uns sicher. Der Einzug erfolgt erst nach Vertragsbestätigung und zum vereinbarten Datum.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Kontoinhaber</label>
                                    <input required name="accountHolder" value={formData.accountHolder} onChange={handleChange} type="text" placeholder="Max Mustermann" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">IBAN</label>
                                    <input required name="iban" value={formData.iban} onChange={handleChange} type="text" placeholder="DE00 0000 0000 0000 0000 00" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">BIC</label>
                                    <input required name="bic" value={formData.bic} onChange={handleChange} type="text" placeholder="XXXXXXXX" className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight text-[#202324]">Fast <span className="text-[#e8ac15]">geschafft.</span></h3>
                            <p className="text-lg text-[#202324]/50 font-medium">Prüfe deine Angaben und bestätige deine Bestellung.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><User size={14} /> Persönliche Daten</h4>
                                    <p className="font-bold text-[#202324]">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">{formData.email}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><Home size={14} /> Lieferadresse</h4>
                                    <p className="font-bold text-[#202324]">{formData.street} {formData.houseNumber}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">{formData.postcode} {formData.city}</p>
                                </div>
                            </div>
                             <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-[#202324]/40"><Activity size={14} /> Vertrag & Zähler</h4>
                                    <p className="font-bold text-[#202324]">{selectedTariff?.tariffName}</p>
                                    <p className="text-sm font-medium text-[#202324]/60">Zähler: {formData.meterNumber}</p>
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
                                <input type="checkbox" required className="mt-1 accent-[#e8ac15]" defaultChecked />
                                <label className="text-sm font-medium text-[#202324]/60 leading-relaxed">
                                    Ich habe die AGB, die Widerrufsbelehrung sowie die Datenschutzbestimmungen gelesen und akzeptiere diese.
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {step === 8 && (
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


                {/* Navigation Buttons */}
                {step < 8 && (
                    <div className="flex items-center justify-between mt-12 pt-12 border-t border-[#202324]/5">
                        {step > 1 ? (
                            <button 
                                type="button"
                                onClick={prevStep}
                                disabled={loading}
                                className="flex items-center gap-2 text-[#202324]/40 hover:text-[#202324] font-bold transition-colors group"
                            >
                                <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Zurück
                            </button>
                        ) : <div />}

                        <button 
                            type="submit"
                            title={step === 7 ? "Jetzt verbindlich abschließen" : "Weiter zum nächsten Schritt"}
                            disabled={loading}
                            className={`flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl group ${loading ? 'bg-[#202324]/10 cursor-not-allowed text-[#202324]/20' : 'bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324]'}`}
                        >
                            {loading ? 'Verarbeite...' : (step === 7 ? 'Jetzt verbindlich abschließen' : 'Weiter zum nächsten Schritt')}
                            {!loading && <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </form>
            
            <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#202324]/20 mt-12 pb-20">
                Sicherer Datentransfer mit 256-Bit SSL-Verschlüsselung
            </p>
        </div>
    );
}
