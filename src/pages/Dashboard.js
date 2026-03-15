import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GlassButton } from '../components/v0/glass-button';
import { Input } from '../components/v0/ui/input';
import { Card, CardContent, CardHeader, CardTitle, } from '../components/v0/ui/card';
import { Search, User, Swords, ShieldAlert, Clock, ScrollText, Newspaper, Users, Gavel, ExternalLink, AlertTriangle, Loader2, } from 'lucide-react';
export default function Dashboard() {
    const navigate = useNavigate();
    const [charName, setCharName] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeUrl, setActiveUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [iframeBlocked, setIframeBlocked] = useState(false);
    async function fetchHistory() {
        try {
            const { data, error } = await supabase
                .from('search_history')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            if (error)
                throw error;
            setHistory(data || []);
        }
        catch (error) {
            console.error('Erro ao buscar histórico:', error);
        }
    }
    useEffect(() => {
        fetchHistory();
    }, []);
    async function handleLogout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
            navigate('/');
        }
        catch (error) {
            console.error('Erro ao sair:', error);
            alert('Erro ao deslogar. Tente novamente.');
        }
    }
    const openLink = (url) => {
        
        setActiveUrl(url);
        setIframeBlocked(false);
        setIsLoading(true);
        
        setTimeout(() => {
            setIframeBlocked(true);
            setIsLoading(false);
        }, 500);
    };
    async function handleSearch(e) {
        e.preventDefault();
        const nameToSearch = charName.trim();
        if (!nameToSearch) {
            alert('Por favor, digite o nome de um personagem.');
            setSearchResult(null);
            return;
        }
        try {
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                return;
            }
            const { error } = await supabase.from('search_history').insert([
                {
                    query: nameToSearch,
                    user_id: user.id,
                    status: 'pending',
                },
            ]);
            if (error)
                throw error;
            setSearchResult(nameToSearch);
            setCharName('');
            fetchHistory();
        }
        catch (error) {
            console.error('Erro ao salvar busca:', error);
            alert('Ocorreu um erro ao salvar sua pesquisa no banco de dados.');
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-transparent text-[#f5e6c8] space-y-8 p-6 lg:p-10 px-8 lg:px-12 relative overflow-x-hidden", children: [_jsx("div", { className: "fixed inset-0 bg-[url('/wallpaper2.jpg')] bg-fixed bg-cover bg-center -z-20 scale-100 opacity-80", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 bg-black/30 -z-10" }), _jsxs("div", { className: "flex justify-between items-center border-b border-[#d4af37]/20 pb-6 pr-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-medieval text-4xl tracking-wide text-[#d4af37]", children: "Dashboard" }), _jsx("p", { className: "text-sm text-[#c4b08a]/60", children: "Bem-vindo, explorador." })] }), _jsx("div", { className: "w-32 flex justify-end pr-2", children: _jsx(GlassButton, { variant: "secondary", onClick: handleLogout, children: "Sair" }) })] }), _jsxs("div", { className: "max-w-4xl mx-auto space-y-6 px-2", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsx(GlassButton, { variant: "secondary", className: "w-full py-2 px-4", onClick: () => openLink('https://www.tibia.com/news/?subtopic=latestnews'), children: _jsxs("div", { className: "flex items-center justify-start w-full gap-3", children: [_jsx(Newspaper, { className: "h-5 w-5 text-[#d4af37] shrink-0" }), _jsx("span", { className: "text-[#c4b08a]", children: "News" })] }) }), _jsx("a", { href: "https://www.tibia.com/news/?subtopic=latestnews", target: "_blank", rel: "noreferrer", className: "absolute top-1 right-1 p-1 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors", title: "Abrir em nova aba", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "relative group", children: [_jsx(GlassButton, { variant: "secondary", className: "w-full py-2 px-4", onClick: () => openLink('https://www.tibia.com/community/?subtopic=characters'), children: _jsxs("div", { className: "flex items-center justify-start w-full gap-3", children: [_jsx(Users, { className: "h-5 w-5 text-[#d4af37] shrink-0" }), _jsx("span", { className: "text-[#c4b08a]", children: "Community" })] }) }), _jsx("a", { href: "https://www.tibia.com/community/?subtopic=characters", target: "_blank", rel: "noreferrer", className: "absolute top-1 right-1 p-1 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors", title: "Abrir em nova aba", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "relative group", children: [_jsx(GlassButton, { variant: "secondary", className: "w-full py-2 px-4", onClick: () => openLink('https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'), children: _jsxs("div", { className: "flex items-center justify-start w-full gap-3", children: [_jsx(Gavel, { className: "h-5 w-5 text-[#d4af37] shrink-0" }), _jsx("span", { className: "text-[#c4b08a]", children: "Bazaar" })] }) }), _jsx("a", { href: "https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades", target: "_blank", rel: "noreferrer", className: "absolute top-1 right-1 p-1 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors", title: "Abrir em nova aba", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] })] }), activeUrl && (_jsxs("div", { className: "w-full space-y-4 animate-in fade-in duration-300", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("a", { href: activeUrl, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-[#c4b08a]/60 hover:text-white text-xs underline", children: [_jsx(ExternalLink, { className: "h-3 w-3" }), " Abrir em nova aba"] }), _jsx("button", { onClick: () => {
                                            setActiveUrl(null);
                                            setIframeBlocked(false);
                                            setIsLoading(false);
                                        }, className: "text-[#d4af37] hover:text-white text-sm underline", children: "Fechar Visualiza\u00E7\u00E3o" })] }), _jsx("div", { className: "relative w-full h-[600px] rounded-xl border border-[#d4af37]/30 overflow-hidden bg-black/60 backdrop-blur-md flex flex-col items-center justify-center", children: isLoading ? (_jsx("div", { className: "absolute inset-0 z-20 flex items-center justify-center bg-black/40", children: _jsx(Loader2, { className: "h-10 w-10 text-[#d4af37] animate-spin" }) })) : iframeBlocked ? (_jsxs("div", { className: "z-30 p-8 text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-200", children: [_jsx(AlertTriangle, { className: "h-16 w-16 text-[#d4af37] mx-auto opacity-80" }), _jsx("p", { className: "text-[#c4b08a]/80 text-sm", children: "O site oficial n\u00E3o permite a visualiza\u00E7\u00E3o interna." }), _jsx("a", { href: activeUrl, target: "_blank", rel: "noreferrer", className: "block", children: _jsx(GlassButton, { variant: "primary", className: "w-full", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ExternalLink, { className: "h-5 w-5" }), " Abrir Site Oficial"] }) }) })] })) : (_jsx("iframe", { src: activeUrl, className: "w-full h-full", title: "Conte\u00FAdo Tibia" }, activeUrl)) })] })), _jsxs("form", { onSubmit: handleSearch, className: "flex flex-col sm:flex-row gap-4 bg-black/40 backdrop-blur-md p-6 pr-8 rounded-xl border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] w-full box-border", children: [_jsxs("div", { className: "relative flex-1 flex items-center", children: [_jsx(Search, { className: "absolute left-3 h-4 w-4 text-[#d4af37]/50 pointer-events-none z-10" }), _jsx(Input, { placeholder: "Ex: Eternal Oblivion...", value: charName, onChange: (e) => setCharName(e.target.value), className: "pl-10 bg-black/60 border-[#d4af37]/20 text-[#f5e6c8] focus:border-[#d4af37] transition-colors w-full h-10" })] }), _jsx("div", { className: "sm:w-44 flex-shrink-0", children: _jsx(GlassButton, { variant: "primary", type: "submit", className: "w-full", children: "Pesquisar" }) })] })] }), searchResult && (_jsx("div", { className: "animate-fade-in-up px-2", children: _jsxs(Card, { className: "max-w-2xl mx-auto bg-black/60 border-[#d4af37]/40 backdrop-blur-md overflow-hidden", children: [_jsx(CardHeader, { className: "bg-[#d4af37]/10 border-b border-[#d4af37]/20", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-[#d4af37]", children: [_jsx(User, { className: "h-5 w-5" }), "Resultado da Busca"] }) }), _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("p", { className: "text-xl mb-2", children: "Informa\u00E7\u00F5es de:" }), _jsx("h3", { className: "text-4xl font-medieval text-white mb-4 uppercase tracking-widest", children: searchResult }), _jsxs("div", { className: "flex justify-center gap-6 text-[#c4b08a]", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Swords, { className: "h-4 w-4" }), " Level: ??"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(ShieldAlert, { className: "h-4 w-4" }), " Vocation: ??"] })] })] })] }) })), _jsx("div", { className: "px-2", children: _jsxs(Card, { className: "bg-black/40 border-[#d4af37]/20 backdrop-blur-sm border", children: [_jsx(CardHeader, { className: "border-b border-[#d4af37]/10", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest", children: [_jsx(ScrollText, { className: "h-5 w-5" }), "\u00DAltimas Consultas"] }) }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-[#d4af37]/10 bg-[#d4af37]/5 text-[#c4b08a] text-xs uppercase", children: [_jsx("th", { className: "p-4", children: "Personagem" }), _jsx("th", { className: "p-4", children: "Data/Hora" }), _jsx("th", { className: "p-4 text-right", children: "Status" })] }) }), _jsx("tbody", { children: history.length > 0 ? (history.map((item) => (_jsxs("tr", { className: "border-b border-[#d4af37]/5 hover:bg-white/5 transition-colors", children: [_jsx("td", { className: "p-4 font-bold text-white", children: item.query }), _jsxs("td", { className: "p-4 text-sm text-[#c4b08a]/60 flex items-center gap-2", children: [_jsx(Clock, { className: "h-3 w-3" }), new Date(item.created_at).toLocaleString('pt-BR')] }), _jsx("td", { className: "p-4 text-right", children: _jsx("span", { className: "px-2 py-1 rounded-full text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-tighter", children: item.status }) })] }, item.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "p-10 text-center text-[#c4b08a]/40 italic", children: "Nenhum hist\u00F3rico de busca encontrado." }) })) })] }) }) })] }) })] }));
}
