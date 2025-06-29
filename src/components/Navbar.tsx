import { Zap } from 'lucide-react'
import React from 'react'

function Navbar() {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">Data Alchemist</h1>
                </div>
            </div>
        </header>
    )
}

export default Navbar